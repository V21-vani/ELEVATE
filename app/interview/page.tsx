'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';

// ── Types ─────────────────────────────────────────────────────────────────────
type Language = 'JavaScript' | 'Python' | 'Java' | 'C++';
type Screen = 'lobby' | 'hr' | 'technical' | 'results' | 'hr-practice';
type LeftTab = 'problem' | 'hints' | 'followups';
type InterviewMode = 'full' | 'technical' | 'hr-practice';

const LANGUAGES: Language[] = ['JavaScript', 'Python', 'Java', 'C++'];
const diffColor: Record<string, string> = { Easy: '#4ade80', Medium: '#fbbf24', Hard: '#f87171' };

// ── HR Concepts for auto-evaluation ──────────────────────────────────────────
interface HRConcept {
  name: string;
  keywords?: string[];
  minLength?: number;
  missingAdvice: string;
}

const HR_CONCEPTS: Record<string, HRConcept[]> = {
  intro: [
    { name: 'Academic or project background', keywords: ['university','college','degree','student','studied','project','built','developed','created','application','worked','intern','course'], missingAdvice: 'Mention where you studied or a specific project you built.' },
    { name: 'Named a concrete skill or tool', keywords: ['python','java','javascript','typescript','react','node','sql','c++','html','css','git','algorithm','data structure','machine learning','api','backend','frontend'], missingAdvice: 'Name at least one specific language or technology you are strong in.' },
    { name: 'Narrative flow (not just facts)', keywords: ['when','during','then','after','started','began','first','decided','realized','moved','eventually','since','led me'], missingAdvice: 'Give it a story arc — past → present → future feels more natural than listing resume points.' },
    { name: 'Motivation for this role', keywords: ['excited','interested','opportunity','role','join','contribute','grow','want to','looking for','passionate','love to','enjoy','reason','why'], missingAdvice: 'End with why you want this kind of role — connect your background to what you are looking for next.' },
  ],
  strength: [
    { name: 'Named a specific skill or tool', keywords: ['python','java','javascript','typescript','react','node','sql','c++','html','css','docker','aws','git','rest','api','algorithm','data','machine learning'], missingAdvice: 'Be specific — say the language, framework, or tool by name.' },
    { name: 'Real project where you used it', keywords: ['project','built','created','developed','used','applied','implemented','application','system','app','website','tool','work','task'], missingAdvice: 'Describe a real project or task where you applied this skill.' },
    { name: 'Outcome or impact', keywords: ['result','improved','faster','reduced','increased','worked','solved','helped','achieved','successful','performance','delivered','completed','outcome','impact'], missingAdvice: 'Say what the project achieved — even "it worked and was used by classmates" counts as an outcome.' },
    { name: 'Awareness of growth areas', keywords: ['learning','still','growing','improving','practice','deeper','better','want to','next','exploring','more','continue','advance'], missingAdvice: 'Show a growth mindset — mention what you are still learning or where you want to go deeper.' },
  ],
  challenge: [
    { name: 'Situation — set the context', keywords: ['project','team','when','working','had','was','during','faced','encountered','issue','problem','bug','error','challenge','deadline','semester'], missingAdvice: 'Describe the situation clearly — what project, when, and what went wrong.' },
    { name: 'Your specific actions (not just "we")', keywords: [' i ','decided','tried','searched','debugged','fixed','refactored','tested','asked','checked','investigated','changed','implemented','wrote','spent','looked'], missingAdvice: 'Own your contribution — use "I" statements rather than only "we did this".' },
    { name: 'Resolution or result', keywords: ['finally','resolved','fixed','worked','solved','succeeded','completed','delivered','managed','ended','outcome','result','got it'], missingAdvice: 'Tell us how it ended — did you fix it, ship on time, or learn something new?' },
    { name: 'Lesson or takeaway', keywords: ['learned','realize','now i','next time','would','takeaway','taught','understand','better','lesson','going forward','changed how','helped me'], missingAdvice: 'Close with what you took away — this is often what interviewers care about most.' },
  ],
  casestudy: [
    { name: 'Triage — reproduce and isolate first', keywords: ['reproduce','check logs','logs','error','trace','identify','find the','isolate','narrow','what is','where is','why is','debug','console','test'], missingAdvice: 'Start with triage — reproduce the bug and isolate where it is before jumping to solutions.' },
    { name: 'Fix or rollback strategy', keywords: ['fix','patch','change','update','rollback','revert','solution','workaround','temporary','deploy','hotfix','code','branch','commit','quick'], missingAdvice: 'Explain your fix plan — and consider whether a rollback might be safer than a rushed fix.' },
    { name: 'Communication with stakeholders', keywords: ['tell','inform','message','email','slack','notify','team','manager','stakeholder','update','communicate','reach out','let them know','status'], missingAdvice: 'Always communicate — even if the team lead is unreachable, update someone (product, client, or peer).' },
    { name: 'Prevention for the future', keywords: ['prevent','future','test','monitor','document','process','next time','avoid','ensure','add test','coverage','alert','automate','check','review'], missingAdvice: 'Propose a prevention measure — tests, monitoring, or a better on-call process shows engineering maturity.' },
  ],
  closing: [
    { name: 'Asked about team or engineering culture', keywords: ['team','culture','work','environment','day','typical','process','collaborate','sprint','agile','decision','how does','engineering','how do you','what is it like'], missingAdvice: 'Ask about the team — how they work, their process, or what the day-to-day looks like.' },
    { name: 'Asked about growth or learning', keywords: ['growth','grow','learn','mentorship','mentor','career','develop','skill','training','opportunity','level','progress','improve','advance'], missingAdvice: 'Ask about your development — mentorship, learning opportunities, or career progression.' },
    { name: 'Showed genuine curiosity about the role', keywords: ['challenge','exciting','building','working on','product','mission','impact','next','goal','priority','direction','why','what does success','how will i'], missingAdvice: 'Ask something that shows you have thought about the role — what they are building, what success looks like.' },
    { name: 'Wrote substantive questions', minLength: 80, missingAdvice: 'Write out complete questions — very short answers here suggest you have not prepared.' },
  ],
};

// ── HR Question Bank ──────────────────────────────────────────────────────────
const HR_QS = [
  {
    id: 'intro',
    q: 'Tell me about yourself.',
    context: 'Classic opener. Keep it under 2 minutes. Structure: past → present → future.',
    tips: [
      'Mention 1–2 concrete projects or experiences',
      'End with why you\'re excited about this opportunity',
      'Don\'t just recite your resume — make it a story',
    ],
  },
  {
    id: 'strength',
    q: 'What is your strongest technical skill, and how have you applied it in a real project?',
    context: 'They want specifics — name the language or tool, describe the project, and mention impact.',
    tips: [
      'Be concrete: "I used Python to build X which did Y"',
      'It\'s fine to say you\'re still learning — show growth mindset',
      'Tie it back to what the role needs',
    ],
  },
  {
    id: 'challenge',
    q: 'Describe a time you faced a tough technical challenge. What happened and how did you resolve it?',
    context: 'Use the STAR method: Situation → Task → Action → Result. Focus on YOUR actions specifically.',
    tips: [
      'Pick something real — even a college project works',
      'Emphasise problem-solving process, not just the outcome',
      'Don\'t say "we" too much — own your contribution',
    ],
  },
  {
    id: 'casestudy',
    q: '📋 Case Study — The Night-Before Bug',
    context: `Scenario: It's 9 PM. Your team has a critical product demo at 10 AM tomorrow. You're the only developer available and you've just discovered a bug that crashes the app on login. The team lead is unreachable.\n\nWalk me through exactly what you do — step by step.`,
    tips: [
      'Think out loud — interviewers want to see your reasoning',
      'Consider: triage → fix → test → communicate → escalate if needed',
      '"I\'d ask for help" is a valid answer — it shows judgment, not weakness',
    ],
  },
  {
    id: 'closing',
    q: 'Do you have any questions for us?',
    context: 'This is not a throwaway question. Good candidates always have questions — it shows genuine interest and that you\'ve done your homework.',
    tips: [
      'Ask about the team\'s tech stack, engineering culture, or how decisions get made',
      'Ask about growth, mentorship, or what success looks like in this role',
      'Avoid salary and benefits in round 1 — ask about the work itself',
    ],
  },
];

// ── DSA Question Bank ─────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays · Hashing',
    problem: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example 1:
  Input:  nums = [2, 7, 11, 15], target = 9
  Output: [0, 1]
  Explanation: nums[0] + nums[1] = 2 + 7 = 9

Example 2:
  Input:  nums = [3, 2, 4], target = 6
  Output: [1, 2]

Constraints:
  • 2 ≤ nums.length ≤ 10⁴
  • Only one valid answer exists.`,
    hints: [
      'Can you think of a data structure that lets you check if a number exists in O(1)?',
      'For each number x, you need target - x. Store seen numbers in a HashMap.',
      'Time complexity should be O(n). Space complexity O(n).',
    ],
    followUps: [
      'What is the time complexity of your solution?',
      'Why a HashMap over nested loops?',
      'What if the array was sorted — could you solve it in O(1) space?',
      'What if there were multiple valid answers?',
    ],
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0, 1]' },
    ],
    starterCode: {
      JavaScript: `function twoSum(nums, target) {\n  // your solution here\n}`,
      Python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # your solution here\n    pass`,
      Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your solution here\n        return new int[]{};\n    }\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // your solution here\n    }\n};`,
    },
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    problem: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
  1. Open brackets must be closed by the same type of brackets.
  2. Open brackets must be closed in the correct order.
  3. Every close bracket has a corresponding open bracket.

Example 1:  s = "()"      → true
Example 2:  s = "()[]{}" → true
Example 3:  s = "(]"     → false`,
    hints: [
      'Think about what data structure maintains order and gives you the last inserted item first.',
      'Use a Stack. Push opening brackets, pop when you see a closing bracket.',
      'At the end, the stack should be empty for a valid string.',
    ],
    followUps: [
      'What data structure did you use and why?',
      'What is the time and space complexity?',
      'What happens if the string is empty — is it valid?',
      'Can you solve this without a stack?',
    ],
    testCases: [
      { input: 's = "()"', expected: 'true' },
      { input: 's = "()[]{}"', expected: 'true' },
      { input: 's = "(]"', expected: 'false' },
    ],
    starterCode: {
      JavaScript: `function isValid(s) {\n  // your solution here\n}`,
      Python: `def is_valid(s: str) -> bool:\n    # your solution here\n    pass`,
      Java: `class Solution {\n    public boolean isValid(String s) {\n        // your solution here\n        return false;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    bool isValid(string s) {\n        // your solution here\n    }\n};`,
    },
  },
  {
    id: 3,
    title: 'Reverse a Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    problem: `Given the head of a singly linked list, reverse the list and return the reversed list.

Example 1:
  Input:  head = [1, 2, 3, 4, 5]
  Output: [5, 4, 3, 2, 1]

Example 2:
  Input:  head = [1, 2]
  Output: [2, 1]

Example 3:
  Input:  head = []
  Output: []

Follow-up: Can you solve it both iteratively AND recursively?`,
    hints: [
      'You need three pointers: prev, current, next.',
      'At each step: save next, flip the pointer, then move forward.',
      'When current becomes null, prev is your new head.',
    ],
    followUps: [
      'Walk me through your approach step by step.',
      'Can you now do it recursively?',
      'What is the time and space complexity of both approaches?',
      'What if it was a doubly linked list?',
    ],
    testCases: [
      { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', expected: '[2,1]' },
      { input: 'head = []', expected: '[]' },
    ],
    starterCode: {
      JavaScript: `function reverseList(head) {\n  // Node: { val, next }\n  // your solution here\n}`,
      Python: `def reverse_list(head):\n    # Node: ListNode(val, next)\n    # your solution here\n    pass`,
      Java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // your solution here\n        return null;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // your solution here\n    }\n};`,
    },
  },
  {
    id: 4,
    title: 'Number of Islands',
    difficulty: 'Medium',
    topic: 'Graphs · BFS/DFS',
    problem: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

Example 1:
  Input: grid = [
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","0"]
  ]
  Output: 1

Example 2:
  Input: grid = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
  ]
  Output: 3`,
    hints: [
      'For each unvisited "1", start a BFS or DFS to mark the entire island as visited.',
      'Count how many times you start a fresh BFS/DFS — that\'s your answer.',
      'You can mark cells as visited by changing "1" to "0" in-place.',
    ],
    followUps: [
      'BFS or DFS — why did you choose that approach?',
      'What is the time and space complexity?',
      'What if the grid wraps around edges (like a globe)?',
      'How would you find the size of the largest island?',
    ],
    testCases: [
      { input: '4×5 grid (Example 1)', expected: '1' },
      { input: '4×5 grid (Example 2)', expected: '3' },
      { input: 'All-water grid', expected: '0' },
    ],
    starterCode: {
      JavaScript: `function numIslands(grid) {\n  // your solution here\n}`,
      Python: `def num_islands(grid: list[list[str]]) -> int:\n    # your solution here\n    pass`,
      Java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // your solution here\n    }\n};`,
    },
  },
  {
    id: 5,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Sliding Window · Hashing',
    problem: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:  s = "abcabcbb"  → 3  (substring "abc")
Example 2:  s = "bbbbb"     → 1  (substring "b")
Example 3:  s = "pwwkew"    → 3  (substring "wke")

Constraints:
  • 0 ≤ s.length ≤ 5 × 10⁴
  • s consists of English letters, digits, symbols and spaces.`,
    hints: [
      'Think about using a sliding window — two pointers (left and right).',
      'Use a Set to track characters in the current window.',
      'When you see a duplicate, shrink the window from the left until it\'s removed.',
    ],
    followUps: [
      'What pattern is this — and when do you reach for a sliding window?',
      'What is the time complexity?',
      'Can you optimise further using a HashMap instead of a Set?',
      'What if the input was a stream of characters instead of a full string?',
    ],
    testCases: [
      { input: 's = "abcabcbb"', expected: '3' },
      { input: 's = "bbbbb"', expected: '1' },
      { input: 's = "pwwkew"', expected: '3' },
    ],
    starterCode: {
      JavaScript: `function lengthOfLongestSubstring(s) {\n  // your solution here\n}`,
      Python: `def length_of_longest_substring(s: str) -> int:\n    # your solution here\n    pass`,
      Java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // your solution here\n        return 0;\n    }\n}`,
      'C++': `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // your solution here\n    }\n};`,
    },
  },
];

// ── HR answer evaluator ───────────────────────────────────────────────────────
function evaluateHRAnswer(questionId: string, answer: string) {
  const text = ' ' + answer.toLowerCase() + ' ';
  const concepts = HR_CONCEPTS[questionId] || [];

  const results = concepts.map(c => {
    let covered = false;
    if (c.minLength) {
      covered = answer.trim().length >= c.minLength;
    } else if (c.keywords) {
      covered = c.keywords.some(kw => text.includes(' ' + kw.toLowerCase() + ' ') || text.includes(kw.toLowerCase()));
    }
    return { name: c.name, covered, advice: c.missingAdvice };
  });

  const coveredCount = results.filter(r => r.covered).length;
  const score = results.length > 0 ? Math.round((coveredCount / results.length) * 100) : 0;
  const feedback =
    score >= 75 ? 'Strong answer — you hit the key elements. Refine delivery and you\'re ready.'
    : score >= 50 ? 'Good start — a few important pieces are missing. See what to add below.'
    : score >= 25 ? 'Needs more depth. Use the hints below to flesh out your answer.'
    : answer.trim().length < 30 ? 'Answer too short to evaluate. Write a full response first.'
    : 'Thin answer — build it up using the element guidance below.';

  return { score, results, feedback };
}

// ── Technical evaluation ──────────────────────────────────────────────────────
function getTopicData(topic: string) {
  const maps: Record<string, { tips: string[]; practiceProblems: string[]; vault: string }> = {
    'Arrays · Hashing': {
      tips: [
        'Master the HashMap pattern: iterate once, store complements or indices.',
        'Know the difference between a Set (existence check) and a Map (key → value lookup).',
        'Always ask: "what complement am I looking for, and can I store it?"',
      ],
      practiceProblems: ['3Sum', 'Group Anagrams', 'Contains Duplicate', 'Top K Frequent Elements'],
      vault: 'DSA → Arrays & Hashing',
    },
    'Stack': {
      tips: [
        'Stacks solve "last seen" and "matching pairs" problems elegantly.',
        'Always ask: what should I push, and what condition triggers a pop?',
        'Draw the stack state at each step — bracket problems become trivial on paper.',
      ],
      practiceProblems: ['Min Stack', 'Daily Temperatures', 'Decode String', 'Asteroid Collision'],
      vault: 'DSA → Stacks & Queues',
    },
    'Linked List': {
      tips: [
        'Draw the pointer diagram before coding — one wrong prev/curr/next order breaks everything.',
        'Practice both iterative (3 pointers) and recursive approaches on the same problem.',
        'Use a dummy head node to simplify edge cases.',
      ],
      practiceProblems: ['Remove Nth From End', 'Detect Cycle', 'Merge Two Sorted Lists', 'LRU Cache'],
      vault: 'DSA → Linked Lists',
    },
    'Graphs · BFS/DFS': {
      tips: [
        'BFS = level-by-level (use a queue). DFS = go deep first (recursion or stack).',
        'Always track visited nodes — without this you will loop forever.',
        'BFS is best for shortest path; DFS is best for connected components.',
      ],
      practiceProblems: ['Clone Graph', 'Pacific Atlantic Water Flow', 'Course Schedule', 'Walls and Gates'],
      vault: 'DSA → Graphs',
    },
    'Sliding Window · Hashing': {
      tips: [
        'Pattern: expand the right pointer, shrink the left when the constraint is violated.',
        'Use a HashMap to track element counts inside the current window.',
        'Identify the constraint clearly before coding — that determines when you shrink.',
      ],
      practiceProblems: ['Minimum Window Substring', 'Permutation in String', 'Fruit Into Baskets', 'Find All Anagrams'],
      vault: 'DSA → Sliding Window',
    },
  };
  return maps[topic] || { tips: ['Review the core DSA fundamentals for this topic.'], practiceProblems: ['LeetCode easy problems in this category'], vault: 'DSA' };
}

function generateEvaluation(
  question: typeof QUESTIONS[0],
  testResults: ('pass' | 'fail' | null)[],
  techTimerSeconds: number,
  code: string,
) {
  const passed = testResults.filter(r => r === 'pass').length;
  const total = question.testCases.length;
  const hasCode = code.trim().length > 80 && !code.includes('your solution here');
  const codeLines = code.split('\n').filter(l => l.trim().length > 0).length;
  const timeTakenSecs = Math.max(0, 45 * 60 - techTimerSeconds);
  const timeTakenMin = Math.floor(timeTakenSecs / 60);

  const correctnessScore = !hasCode ? 0 : Math.round((passed / total) * 40);

  let approachScore = 0;
  if (hasCode) {
    if (codeLines >= 12) approachScore = 28;
    else if (codeLines >= 8) approachScore = 22;
    else if (codeLines >= 5) approachScore = 15;
    else approachScore = 8;
    if (passed === total) approachScore = Math.min(30, approachScore + 2);
  }

  let timeScore = 0;
  if (timeTakenSecs > 0) {
    if (timeTakenMin <= 15) timeScore = 30;
    else if (timeTakenMin <= 22) timeScore = 24;
    else if (timeTakenMin <= 30) timeScore = 18;
    else if (timeTakenMin <= 38) timeScore = 11;
    else timeScore = 5;
  }

  const overallScore = correctnessScore + approachScore + timeScore;

  const correctnessFeedback = !hasCode
    ? 'No solution written. Start with the function signature and a brute-force approach.'
    : passed === total ? 'All test cases passed — solid correctness. Make sure you can explain the complexity.'
    : passed === 0 ? 'All tests failing. Trace through a small example by hand and check your base logic.'
    : `${passed}/${total} tests passing. Check edge cases: empty input, duplicates, and boundary values.`;

  const approachFeedback = !hasCode
    ? 'Write something — even brute-force O(n²) is a valid starting point.'
    : codeLines < 5 ? 'Very short solution — make sure it handles all cases, not just the happy path.'
    : codeLines < 10 ? 'Reasonable length. Ensure variable names are clear and logic reads easily.'
    : 'Good solution length. Now focus on whether you can explain the time/space trade-off clearly.';

  const timeFeedback = timeTakenSecs === 0
    ? 'Timer was not started — always time yourself to build realistic interview pacing.'
    : timeTakenMin <= 15 ? 'Excellent pace. Solving in under 15 minutes is a strong interview signal.'
    : timeTakenMin <= 22 ? 'Good timing — comfortably within the typical interview window.'
    : timeTakenMin <= 30 ? 'A bit slow. Practice recognising the pattern faster to build speed.'
    : 'Over 30 minutes. Focus on pattern recognition: HashMap for lookup, Stack for LIFO, Sliding Window for subarrays.';

  return { overallScore, correctnessScore, approachScore, timeScore, correctnessFeedback, approachFeedback, timeFeedback, passed, total, timeTakenMin, topicData: getTopicData(question.topic) };
}

// ── Timer Hook ────────────────────────────────────────────────────────────────
function useTimer(startSeconds: number) {
  const [seconds, setSeconds] = useState(startSeconds);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      ref.current = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, seconds]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return {
    display: fmt(seconds), running, seconds,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: () => { setRunning(false); setSeconds(startSeconds); },
    pct: (startSeconds - seconds) / startSeconds,
  };
}

// ── Round header bar ──────────────────────────────────────────────────────────
function RoundBar({ label, timer, onLeave }: {
  label: string;
  timer: ReturnType<typeof useTimer>;
  onLeave: () => void;
}) {
  const timerColor = timer.pct > 0.8 ? '#f87171' : timer.pct > 0.6 ? '#fbbf24' : '#f97316';
  return (
    <>
      <div style={{ background: '#111', borderBottom: '1px solid #222', height: 52, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, flexShrink: 0 }}>
        <span style={{ fontWeight: 900, color: '#f97316', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Elevate</span>
        <div style={{ width: 1, height: 18, background: '#2a2a2a' }} />
        <span style={{ fontSize: 12, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: timerColor }}>{timer.display}</div>
        <button onClick={timer.running ? timer.pause : timer.start} style={{ background: '#222', border: '1px solid #333', borderRadius: 3, padding: '5px 12px', color: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
          {timer.running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={onLeave} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 3, padding: '6px 14px', color: '#555', cursor: 'pointer', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
          Leave
        </button>
      </div>
      <div style={{ height: 3, background: '#1e1e1e' }}>
        <div style={{ height: '100%', width: `${timer.pct * 100}%`, background: timerColor, transition: 'width 1s linear, background 0.5s' }} />
      </div>
    </>
  );
}

function scoreColor(score: number) {
  if (score >= 75) return '#4ade80';
  if (score >= 50) return '#fbbf24';
  if (score >= 25) return '#f97316';
  return '#f87171';
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function InterviewPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('lobby');
  const [mode, setMode] = useState<InterviewMode>('full');
  const [qIdx, setQIdx] = useState(0); // set randomly on enter, never shown in lobby
  const [language, setLanguage] = useState<Language>('JavaScript');

  // HR round
  const [hrQIdx, setHrQIdx] = useState(0);
  const [hrAnswers, setHrAnswers] = useState<Record<string, string>>({});

  // Technical round
  const [codeMap, setCodeMap] = useState<Record<Language, string>>({ JavaScript: '', Python: '', Java: '', 'C++': '' });
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState<LeftTab>('problem');
  const [hintIdx, setHintIdx] = useState(-1);
  const [testResults, setTestResults] = useState<('pass' | 'fail' | null)[]>([]);
  const [testRunning, setTestRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // HR Practice
  const [hpQIdx, setHpQIdx] = useState(0);
  const [hpAnswers, setHpAnswers] = useState<Record<string, string>>({});
  const [hpEvaluated, setHpEvaluated] = useState<Record<string, boolean>>({});
  const [hpDone, setHpDone] = useState(false);

  const hrTimer = useTimer(20 * 60);
  const techTimer = useTimer(45 * 60);

  const q = QUESTIONS[qIdx];
  const hrQ = HR_QS[hrQIdx];

  function enterInterview() {
    if (mode === 'hr-practice') {
      setHpQIdx(0); setHpAnswers({}); setHpEvaluated({}); setHpDone(false);
      setScreen('hr-practice');
      return;
    }
    const randomIdx = Math.floor(Math.random() * QUESTIONS.length);
    setQIdx(randomIdx);
    const picked = QUESTIONS[randomIdx];
    const initial: Record<Language, string> = {
      JavaScript: picked.starterCode.JavaScript,
      Python: picked.starterCode.Python,
      Java: picked.starterCode.Java,
      'C++': picked.starterCode['C++'],
    };
    setCodeMap(initial);
    setTestResults(q.testCases.map(() => null));
    setHintIdx(-1); setTab('problem'); setSubmitted(false); setNotes('');
    if (mode === 'full') {
      setHrQIdx(0); setHrAnswers({});
      setScreen('hr');
      hrTimer.reset(); hrTimer.start();
    } else {
      setScreen('technical');
      techTimer.reset(); techTimer.start();
    }
  }

  function proceedToTechnical() {
    hrTimer.pause();
    setScreen('technical');
    techTimer.reset(); techTimer.start();
  }

  function runTests() {
    setTestRunning(true);
    setTimeout(() => {
      const code = codeMap[language];
      const hasRealCode = code.trim().length > 80 && !code.includes('your solution here');
      const results: ('pass' | 'fail')[] = q.testCases.map((_, i) => {
        if (!hasRealCode) return 'fail';
        if (i === q.testCases.length - 1 && Math.random() > 0.65) return 'fail';
        return 'pass';
      });
      setTestResults(results);
      setTestRunning(false);
    }, 1800);
  }

  function submitSolution() {
    if (!submitted) { setSubmitted(true); techTimer.pause(); }
    setScreen('results');
  }

  function leaveRoom() {
    hrTimer.reset(); techTimer.reset();
    setScreen('lobby'); setSubmitted(false);
  }

  // ── LOBBY ───────────────────────────────────────────────────────────────────
  if (screen === 'lobby') return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px 60px' }}>

        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Mock Interview Sandbox</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>Interview Practice</h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 6, lineHeight: 1.7 }}>
            Run a full mock interview, practice coding problems, or drill your HR answers solo.
          </p>
        </div>

        {/* Mode */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Mode</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {([
              ['full', '🎯', 'Full Interview', 'HR round (20 min) + Technical (45 min)'] as const,
              ['technical', '💻', 'Technical Only', 'Straight to the coding problem'] as const,
              ['hr-practice', '🗣', 'HR Practice', 'Solo — practice & evaluate your answers'] as const,
            ]).map(([m, icon, label, desc]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                background: mode === m ? 'rgba(249,115,22,0.1)' : '#222',
                border: mode === m ? '1px solid #f97316' : '1px solid #2a2a2a',
                borderRadius: 3, padding: '18px 14px', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 12, color: '#fff' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.4 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {mode !== 'hr-practice' && (
          <>
            {/* Language */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Language</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {LANGUAGES.map(l => (
                  <button key={l} onClick={() => setLanguage(l)} style={{
                    flex: 1, background: language === l ? 'rgba(249,115,22,0.1)' : '#222',
                    border: language === l ? '1px solid #f97316' : '1px solid #2a2a2a',
                    borderRadius: 3, padding: '10px 6px', cursor: 'pointer',
                    color: language === l ? '#f97316' : '#888', fontSize: 11, fontWeight: 700,
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Question is assigned randomly on start — not shown here */}
          </>
        )}

        {mode === 'hr-practice' && (
          <div style={{ marginBottom: 24, background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 4, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f97316', marginBottom: 6 }}>How it works</div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
              Answer all 5 HR questions, then click Evaluate to get instant feedback on what you covered and what was missing.
              No self-marking — your answer is analysed automatically.
            </div>
          </div>
        )}

        <button onClick={enterInterview} style={{
          width: '100%', background: '#f97316', color: '#fff',
          border: 'none', borderRadius: 3, padding: '14px',
          fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
        }}>
          {mode === 'hr-practice' ? 'Start HR Practice →' : mode === 'full' ? 'Start Interview →' : 'Start Coding →'}
        </button>
      </div>
    </div>
  );

  // ── HR ROUND ─────────────────────────────────────────────────────────────────
  if (screen === 'hr') return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RoundBar label="HR Round" timer={hrTimer} onLeave={leaveRoom} />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '18px 0 0' }}>
        {HR_QS.map((_, i) => (
          <button key={i} onClick={() => setHrQIdx(i)} style={{
            width: i === hrQIdx ? 28 : 8, height: 8, borderRadius: 4, border: 'none',
            background: i < hrQIdx ? '#f97316' : i === hrQIdx ? '#f97316' : '#2a2a2a',
            opacity: i === hrQIdx ? 1 : i < hrQIdx ? 0.55 : 0.35,
            cursor: 'pointer', transition: 'all 0.3s', padding: 0,
          }} />
        ))}
        <span style={{ fontSize: 11, color: '#444', marginLeft: 8, fontWeight: 700 }}>{hrQIdx + 1} / {HR_QS.length}</span>
      </div>

      <div style={{ maxWidth: 740, margin: '0 auto', width: '100%', padding: '32px 40px', overflow: 'auto' }}>
        <div style={{ fontSize: 11, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
          Question {hrQIdx + 1} of {HR_QS.length}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.4, marginBottom: 12 }}>{hrQ.q}</h2>

        {hrQ.id === 'casestudy' ? (
          <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 4, padding: '16px 18px', marginBottom: 20, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {hrQ.context}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75, marginBottom: 20 }}>{hrQ.context}</p>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a3a3a', marginBottom: 10 }}>Tips</div>
          {hrQ.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 }}>
              <span style={{ color: '#f97316', fontSize: 11, marginTop: 3, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 12, color: '#555', lineHeight: 1.65 }}>{tip}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a3a3a', marginBottom: 8 }}>Your Draft / Notes</div>
          <textarea
            value={hrAnswers[hrQ.id] || ''}
            onChange={e => setHrAnswers(prev => ({ ...prev, [hrQ.id]: e.target.value }))}
            placeholder="Jot down key points before you speak — structure your answer here..."
            style={{
              width: '100%', minHeight: 160, background: '#111', border: '1px solid #2a2a2a', borderRadius: 3,
              padding: '14px 16px', color: '#ccc', fontSize: 13, lineHeight: 1.75,
              fontFamily: 'system-ui, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setHrQIdx(i => Math.max(0, i - 1))} disabled={hrQIdx === 0} style={{
            background: 'none', border: '1px solid #2a2a2a', borderRadius: 3, padding: '9px 18px',
            color: hrQIdx === 0 ? '#2a2a2a' : '#777', cursor: hrQIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700,
          }}>
            ← Back
          </button>
          {hrQIdx < HR_QS.length - 1 ? (
            <button onClick={() => setHrQIdx(i => i + 1)} style={{ background: '#222', border: '1px solid #333', borderRadius: 3, padding: '9px 20px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              Next Question →
            </button>
          ) : (
            <button onClick={proceedToTechnical} style={{ background: '#f97316', border: 'none', borderRadius: 3, padding: '10px 22px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Start Technical Round →
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── TECHNICAL ROUND ───────────────────────────────────────────────────────────
  if (screen === 'technical') return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RoundBar label="Technical Round" timer={techTimer} onLeave={leaveRoom} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>

        {/* LEFT — problem panel */}
        <div style={{ borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>{q.title}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: diffColor[q.difficulty], textTransform: 'uppercase' }}>{q.difficulty}</span>
            <span style={{ fontSize: 10, color: '#444' }}>{q.topic}</span>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #222' }}>
            {(['problem', 'hints', 'followups'] as LeftTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: 'none', border: 'none',
                borderBottom: tab === t ? '2px solid #f97316' : '2px solid transparent',
                color: tab === t ? '#f97316' : '#555',
                padding: '9px 18px', fontSize: 11, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.09em',
                cursor: 'pointer', marginBottom: -1,
              }}>
                {t === 'followups' ? 'Follow-Up Qs' : t}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
            {tab === 'problem' && (
              <pre style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#aaa', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
                {q.problem}
              </pre>
            )}
            {tab === 'hints' && (
              <div>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>Reveal hints one at a time if you're stuck.</p>
                {q.hints.map((h, i) => (
                  <button key={i} onClick={() => setHintIdx(i === hintIdx ? i - 1 : i)} style={{
                    width: '100%', background: hintIdx >= i ? 'rgba(249,115,22,0.08)' : '#222',
                    border: hintIdx >= i ? '1px solid rgba(249,115,22,0.3)' : '1px solid #2a2a2a',
                    borderRadius: 3, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: hintIdx >= i ? 6 : 0 }}>
                      Hint {i + 1}
                    </div>
                    {hintIdx >= i
                      ? <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{h}</div>
                      : <div style={{ fontSize: 12, color: '#444' }}>Click to reveal</div>
                    }
                  </button>
                ))}
              </div>
            )}
            {tab === 'followups' && (
              <div>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>Think through these after you've solved it — interviewers often ask these next.</p>
                {q.followUps.map((fq, i) => (
                  <div key={i} style={{ background: '#222', border: '1px solid #2a2a2a', borderRadius: 3, padding: '14px 16px', marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Q{i + 1}</div>
                    <div style={{ fontSize: 14, color: '#ddd', lineHeight: 1.6, fontStyle: 'italic' }}>"{fq}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — code editor */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #222', flexShrink: 0 }}>
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setLanguage(l)} style={{
                flex: 1, background: language === l ? '#1a1a1a' : '#111',
                border: 'none', borderRight: '1px solid #222',
                borderBottom: language === l ? '2px solid #f97316' : '2px solid transparent',
                color: language === l ? '#fff' : '#555',
                padding: '10px 6px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
              }}>
                {l}
              </button>
            ))}
          </div>

          <textarea
            value={codeMap[language]}
            onChange={e => setCodeMap(prev => ({ ...prev, [language]: e.target.value }))}
            spellCheck={false}
            style={{
              flex: 1, background: '#0d0d0d', color: '#e2e8f0',
              border: 'none', outline: 'none', padding: '18px 22px',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 13, lineHeight: 1.9, resize: 'none', minHeight: 220,
            }}
          />

          {/* Test cases */}
          <div style={{ borderTop: '1px solid #222', background: '#111', flexShrink: 0 }}>
            <div style={{ padding: '10px 18px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Test Cases</span>
              <span style={{ fontSize: 10, color: '#2a2a2a', border: '1px solid #2a2a2a', borderRadius: 2, padding: '1px 6px' }}>Simulated</span>
              <div style={{ flex: 1 }} />
              {!submitted && (
                <>
                  <button onClick={runTests} disabled={testRunning} style={{
                    background: '#222', border: '1px solid #333', borderRadius: 3,
                    padding: '6px 14px', color: testRunning ? '#444' : '#fff',
                    cursor: testRunning ? 'not-allowed' : 'pointer',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    {testRunning ? '◌  Running...' : '▶  Run Tests'}
                  </button>
                  <button onClick={submitSolution} style={{
                    background: '#f97316', border: 'none', borderRadius: 3,
                    padding: '6px 18px', color: '#fff', cursor: 'pointer',
                    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    Submit
                  </button>
                </>
              )}
            </div>
            <div style={{ padding: '10px 18px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {q.testCases.map((tc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: testResults[i] === 'pass' ? 'rgba(74,222,128,0.2)' : testResults[i] === 'fail' ? 'rgba(248,113,113,0.2)' : '#1e1e1e',
                    border: `1px solid ${testResults[i] === 'pass' ? '#4ade80' : testResults[i] === 'fail' ? '#f87171' : '#2a2a2a'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 900,
                    color: testResults[i] === 'pass' ? '#4ade80' : '#f87171',
                  }}>
                    {testResults[i] === 'pass' ? '✓' : testResults[i] === 'fail' ? '✗' : ''}
                  </div>
                  <span style={{ fontSize: 11, color: '#555', fontFamily: 'monospace', flex: 1 }}>{tc.input}</span>
                  <span style={{ fontSize: 11, color: '#333', fontFamily: 'monospace' }}>→ {tc.expected}</span>
                  {testResults[i] && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: testResults[i] === 'pass' ? '#4ade80' : '#f87171', textTransform: 'uppercase', minWidth: 28 }}>
                      {testResults[i]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scratch pad */}
          <div style={{ borderTop: '1px solid #222', flexShrink: 0 }}>
            <div style={{ padding: '8px 18px', background: '#111', borderBottom: '1px solid #1e1e1e' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scratch Pad / Approach</span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Plan your approach before coding — think out loud here..."
              style={{
                width: '100%', height: 80, background: '#1a1a1a', color: '#666',
                border: 'none', outline: 'none', padding: '12px 18px',
                fontFamily: 'system-ui, sans-serif', fontSize: 12, lineHeight: 1.7,
                resize: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────────
  if (screen === 'results') {
    const ev = generateEvaluation(q, testResults, techTimer.seconds, codeMap[language]);

    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        <Nav />
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px 80px' }}>

          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Session Complete</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6, color: '#fff' }}>Your Performance Report</h1>
            <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
              {q.title} · {q.difficulty} · {q.topic} · {language} · {ev.timeTakenMin} min
            </p>
          </div>

          {/* Overall score */}
          <div style={{ background: '#111', border: `1px solid ${scoreColor(ev.overallScore)}44`, borderRadius: 6, padding: '28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: scoreColor(ev.overallScore), lineHeight: 1, fontFamily: 'monospace' }}>{ev.overallScore}</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>/ 100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                {ev.overallScore >= 80 ? 'Strong performance' : ev.overallScore >= 60 ? 'Good — with room to grow' : ev.overallScore >= 40 ? 'Needs more practice' : 'Keep going — this is how you improve'}
              </div>
              <div style={{ background: '#1e1e1e', borderRadius: 3, height: 8, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', width: `${ev.overallScore}%`, background: scoreColor(ev.overallScore), borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'Correctness', val: ev.correctnessScore, max: 40 },
                  { label: 'Approach', val: ev.approachScore, max: 30 },
                  { label: 'Time', val: ev.timeScore, max: 30 },
                ].map(d => (
                  <div key={d.label} style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{d.label}</div>
                    <div style={{ background: '#1e1e1e', borderRadius: 2, height: 4 }}>
                      <div style={{ height: '100%', width: `${(d.val / d.max) * 100}%`, background: scoreColor(Math.round((d.val / d.max) * 100)), borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 3, fontFamily: 'monospace' }}>{d.val}/{d.max}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test results */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '20px 22px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 14 }}>Test Results</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {testResults.map((r, i) => (
                <div key={i} style={{
                  flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 3,
                  background: r === 'pass' ? 'rgba(74,222,128,0.08)' : r === 'fail' ? 'rgba(248,113,113,0.08)' : '#1e1e1e',
                  border: `1px solid ${r === 'pass' ? 'rgba(74,222,128,0.3)' : r === 'fail' ? 'rgba(248,113,113,0.3)' : '#2a2a2a'}`,
                  color: r === 'pass' ? '#4ade80' : r === 'fail' ? '#f87171' : '#444',
                  fontSize: 14, fontWeight: 900,
                }}>
                  {r === 'pass' ? '✓' : r === 'fail' ? '✗' : '—'}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>{ev.correctnessFeedback}</div>
          </div>

          {/* Dimension breakdown */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '20px 22px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 16 }}>Breakdown</div>
            {[
              { label: '🧩 Approach & Code Quality', text: ev.approachFeedback, score: ev.approachScore, max: 30 },
              { label: '⏱ Time Management', text: ev.timeFeedback, score: ev.timeScore, max: 30 },
            ].map(d => (
              <div key={d.label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: scoreColor(Math.round((d.score / d.max) * 100)) }}>{d.score}/{d.max}</span>
                </div>
                <div style={{ fontSize: 12, color: '#555', lineHeight: 1.65 }}>{d.text}</div>
              </div>
            ))}
          </div>

          {/* Where to improve */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '20px 22px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 16 }}>Where to Improve — {q.topic}</div>
            {ev.topicData.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 900, color: '#f97316' }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, color: '#888', lineHeight: 1.65 }}>{tip}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#333', letterSpacing: '0.07em', marginBottom: 10 }}>Practice These Next</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ev.topicData.practiceProblems.map(p => (
                  <span key={p} style={{ background: '#222', border: '1px solid #2a2a2a', borderRadius: 3, padding: '4px 10px', fontSize: 11, color: '#666' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div style={{ background: '#111', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 4, padding: '20px 22px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#f97316', letterSpacing: '0.08em', marginBottom: 12 }}>Recommended Next Steps</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 16, lineHeight: 1.6 }}>
              Focus on <strong style={{ color: '#ccc' }}>DSA — {q.topic}</strong>. Head to the Daily Sprint for matched practice problems, or the Concept Vault for core concepts and resources.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => router.push('/sprint')} style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 3, padding: '14px 16px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 16, marginBottom: 6 }}>🏃</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#f97316' }}>Daily Sprint</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>Problems matched to your weak areas</div>
              </button>
              <button onClick={() => router.push('/vault')} style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 3, padding: '14px 16px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 16, marginBottom: 6 }}>📚</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>Concept Vault</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{ev.topicData.vault}</div>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={leaveRoom} style={{ flex: 1, background: '#222', border: '1px solid #333', borderRadius: 3, padding: '12px', color: '#777', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Back to Lobby
            </button>
            <button onClick={() => { setMode('hr-practice'); setScreen('hr-practice'); setHpQIdx(0); setHpAnswers({}); setHpEvaluated({}); setHpDone(false); }} style={{ flex: 1, background: '#222', border: '1px solid #333', borderRadius: 3, padding: '12px', color: '#ccc', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Practice HR Questions →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── HR PRACTICE (SOLO) ────────────────────────────────────────────────────────
  if (screen === 'hr-practice') {
    const hpQ = HR_QS[hpQIdx];
    const isEvaluated = !!hpEvaluated[hpQ.id];
    const evalResult = isEvaluated ? evaluateHRAnswer(hpQ.id, hpAnswers[hpQ.id] || '') : null;

    // Overall readiness score across all evaluated questions
    const totalScore = HR_QS.reduce((sum, hq) => {
      if (!hpEvaluated[hq.id]) return sum;
      return sum + evaluateHRAnswer(hq.id, hpAnswers[hq.id] || '').score;
    }, 0);
    const evaluatedCount = HR_QS.filter(hq => hpEvaluated[hq.id]).length;
    const avgScore = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : 0;

    if (hpDone) {
      return (
        <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
          <Nav />
          <div style={{ maxWidth: 620, margin: '0 auto', padding: '60px 24px 80px' }}>
            <div style={{ marginBottom: 32 }}>
              <span className="section-label">HR Practice Complete</span>
              <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>Your HR Readiness</h1>
            </div>

            {/* Overall score */}
            <div style={{ background: '#111', border: `1px solid ${scoreColor(avgScore)}44`, borderRadius: 6, padding: '28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 52, fontWeight: 900, color: scoreColor(avgScore), lineHeight: 1, fontFamily: 'monospace' }}>{avgScore}</div>
                <div style={{ fontSize: 11, color: '#444', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>/ 100</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                  {avgScore >= 75 ? 'HR-ready — strong communication skills' : avgScore >= 50 ? 'Good foundation — a few gaps to close' : avgScore >= 25 ? 'Needs more structure and preparation' : 'Focus on learning the key frameworks first'}
                </div>
                <div style={{ background: '#1e1e1e', borderRadius: 3, height: 8 }}>
                  <div style={{ height: '100%', width: `${avgScore}%`, background: scoreColor(avgScore), borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: '#444', marginTop: 8 }}>{evaluatedCount} of {HR_QS.length} questions evaluated</div>
              </div>
            </div>

            {/* Per-question breakdown */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 16 }}>Question Breakdown</div>
              {HR_QS.map(hq => {
                if (!hpEvaluated[hq.id]) {
                  return (
                    <div key={hq.id} style={{ marginBottom: 14, opacity: 0.4 }}>
                      <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{hq.q} <span style={{ fontSize: 10, color: '#444' }}>— not evaluated</span></div>
                    </div>
                  );
                }
                const { score, results } = evaluateHRAnswer(hq.id, hpAnswers[hq.id] || '');
                const missed = results.filter(r => !r.covered);
                return (
                  <div key={hq.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#ccc', fontWeight: 600, flex: 1, paddingRight: 12 }}>{hq.q}</span>
                      <span style={{ fontSize: 13, fontFamily: 'monospace', color: scoreColor(score), flexShrink: 0, fontWeight: 800 }}>{score}%</span>
                    </div>
                    <div style={{ background: '#1e1e1e', borderRadius: 2, height: 5, marginBottom: 8 }}>
                      <div style={{ height: '100%', width: `${score}%`, background: scoreColor(score), borderRadius: 2 }} />
                    </div>
                    {missed.length > 0 && (
                      <div style={{ fontSize: 11, color: '#444', lineHeight: 1.6 }}>
                        Missing: {missed.map(m => m.name).join(' · ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Improvement tips */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '20px 22px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 14 }}>How to Get Better</div>
              {[
                'Record yourself answering each question out loud. Listen back — does it sound natural and confident?',
                'Drill the STAR structure daily: Situation → Task → Action → Result for every behavioural question.',
                'Build 3 "anchor stories" from real experiences that you can adapt to any behavioural question.',
                'For the case study, narrate your reasoning out loud — silence in real interviews hurts your score.',
                'Research companies before HR rounds. Tailoring your "why this role" answer wins points immediately.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ color: '#f97316', fontSize: 11, marginTop: 2, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setHpQIdx(0); setHpDone(false); }} style={{ flex: 1, background: '#222', border: '1px solid #333', borderRadius: 3, padding: '12px', color: '#777', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Practice Again
              </button>
              <button onClick={() => router.push('/dashboard')} style={{ flex: 1, background: '#f97316', border: 'none', borderRadius: 3, padding: '12px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Back to Dashboard →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        <Nav />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <span className="section-label">HR Practice — Solo Mode</span>
              <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>Question {hpQIdx + 1} of {HR_QS.length}</h1>
            </div>
            <button onClick={() => setScreen('lobby')} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 3, padding: '6px 14px', color: '#555', cursor: 'pointer', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Exit
            </button>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            {HR_QS.map((hq, i) => (
              <button key={i} onClick={() => setHpQIdx(i)} style={{
                width: i === hpQIdx ? 28 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0,
                background: hpEvaluated[hq.id] ? '#4ade80' : i === hpQIdx ? '#f97316' : '#2a2a2a',
                opacity: i === hpQIdx ? 1 : 0.6,
                cursor: 'pointer', transition: 'all 0.3s',
              }} />
            ))}
            {evaluatedCount > 0 && (
              <span style={{ fontSize: 11, color: '#444', marginLeft: 8, fontWeight: 700 }}>avg {avgScore}%</span>
            )}
          </div>

          {/* Question */}
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '24px', marginBottom: 20 }}>
            {hpQ.id === 'casestudy' ? (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 14 }}>{hpQ.q}</h2>
                <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 4, padding: '14px 16px', fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {hpQ.context}
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 10 }}>{hpQ.q}</h2>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{hpQ.context}</p>
              </>
            )}
          </div>

          {/* Answer textarea */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#444', marginBottom: 8 }}>Your Answer</div>
            <textarea
              value={hpAnswers[hpQ.id] || ''}
              onChange={e => {
                setHpAnswers(prev => ({ ...prev, [hpQ.id]: e.target.value }));
                if (hpEvaluated[hpQ.id]) setHpEvaluated(prev => ({ ...prev, [hpQ.id]: false }));
              }}
              placeholder="Write your full answer here. Aim for 150–250 words — enough to cover all the key elements."
              style={{
                width: '100%', minHeight: 200, background: '#111', border: '1px solid #2a2a2a', borderRadius: 3,
                padding: '14px 16px', color: '#ccc', fontSize: 13, lineHeight: 1.8,
                fontFamily: 'system-ui, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 11, color: '#333', marginTop: 4 }}>
              {(hpAnswers[hpQ.id] || '').trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Evaluate button */}
          {!isEvaluated && (
            <button
              onClick={() => setHpEvaluated(prev => ({ ...prev, [hpQ.id]: true }))}
              disabled={!(hpAnswers[hpQ.id] || '').trim()}
              style={{
                width: '100%', marginBottom: 20,
                background: (hpAnswers[hpQ.id] || '').trim() ? '#f97316' : '#2a2a2a',
                border: 'none', borderRadius: 3, padding: '12px', cursor: (hpAnswers[hpQ.id] || '').trim() ? 'pointer' : 'not-allowed',
                color: (hpAnswers[hpQ.id] || '').trim() ? '#fff' : '#444',
                fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
              }}
            >
              Evaluate My Answer →
            </button>
          )}

          {/* Evaluation result */}
          {isEvaluated && evalResult && (
            <div style={{ background: '#111', border: `1px solid ${scoreColor(evalResult.score)}44`, borderRadius: 4, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em' }}>Answer Evaluation</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor(evalResult.score), fontFamily: 'monospace' }}>{evalResult.score}%</div>
              </div>

              <div style={{ background: '#1e1e1e', borderRadius: 3, height: 6, marginBottom: 14 }}>
                <div style={{ height: '100%', width: `${evalResult.score}%`, background: scoreColor(evalResult.score), borderRadius: 3 }} />
              </div>

              <div style={{ fontSize: 13, color: '#777', marginBottom: 18, lineHeight: 1.6 }}>{evalResult.feedback}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {evalResult.results.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: r.covered ? 'rgba(74,222,128,0.05)' : 'rgba(248,113,113,0.05)',
                    border: `1px solid ${r.covered ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.12)'}`,
                    borderRadius: 3, padding: '12px 14px',
                  }}>
                    <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{r.covered ? '✅' : '⚠️'}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: r.covered ? '#4ade80' : '#f87171', marginBottom: r.covered ? 0 : 4 }}>
                        {r.name}
                      </div>
                      {!r.covered && (
                        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.55 }}>{r.advice}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setHpEvaluated(prev => ({ ...prev, [hpQ.id]: false }))}
                style={{ marginTop: 14, background: 'none', border: '1px solid #2a2a2a', borderRadius: 3, padding: '7px 14px', color: '#555', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
              >
                Edit Answer
              </button>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setHpQIdx(i => Math.max(0, i - 1))} disabled={hpQIdx === 0} style={{
              background: 'none', border: '1px solid #2a2a2a', borderRadius: 3, padding: '9px 18px',
              color: hpQIdx === 0 ? '#2a2a2a' : '#777', cursor: hpQIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700,
            }}>
              ← Back
            </button>
            {hpQIdx < HR_QS.length - 1 ? (
              <button onClick={() => setHpQIdx(i => i + 1)} style={{ background: '#222', border: '1px solid #333', borderRadius: 3, padding: '9px 20px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                Next Question →
              </button>
            ) : (
              <button onClick={() => setHpDone(true)} style={{ background: '#f97316', border: 'none', borderRadius: 3, padding: '10px 22px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                See My HR Score →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
