'use client';
import { useState, useEffect, useRef } from 'react';
import Nav from '@/components/Nav';

// ── Types ─────────────────────────────────────────────────────────────────────
type Language = 'JavaScript' | 'Python' | 'Java' | 'C++';
type Screen = 'lobby' | 'hr' | 'technical';
type LeftTab = 'problem' | 'hints' | 'followups';
type InterviewMode = 'full' | 'technical';
type RatingKey = 'problemSolving' | 'codeQuality' | 'communication' | 'timeManagement';

const LANGUAGES: Language[] = ['JavaScript', 'Python', 'Java', 'C++'];
const diffColor: Record<string, string> = { Easy: '#4ade80', Medium: '#fbbf24', Hard: '#f87171' };

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
    followUps: [
      'What\'s the project you\'re most proud of and why?',
      'How did you first get into programming?',
      'What does your ideal role look like?',
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
    followUps: [
      'How do you stay up to date in that area?',
      'Have you had to teach this to someone else?',
      'What\'s something you wish you knew earlier about it?',
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
    followUps: [
      'What would you do differently if you faced the same problem today?',
      'How did the team respond to your approach?',
      'What did you learn from that experience?',
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
    followUps: [
      'How would you communicate this to non-technical stakeholders?',
      'What if your fix introduced a different bug?',
      'What would you put in place to prevent this in future?',
      'At what point would you decide to roll back instead of fix?',
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
    followUps: ['(Let the candidate ask their questions — no probing needed here)'],
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
    display: fmt(seconds),
    running,
    seconds,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: () => { setRunning(false); setSeconds(startSeconds); },
    pct: (startSeconds - seconds) / startSeconds,
  };
}

// ── Shared Room Nav Bar ───────────────────────────────────────────────────────
function RoomBar({
  label, roomCode, role, timer, onLeave,
}: {
  label: string;
  roomCode: string;
  role: 'interviewer' | 'interviewee' | null;
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
        <span style={{ fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 3, padding: '2px 10px', color: '#888', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{roomCode}</span>
        <span style={{
          fontSize: 11,
          background: role === 'interviewer' ? 'rgba(249,115,22,0.15)' : 'rgba(96,165,250,0.15)',
          color: role === 'interviewer' ? '#f97316' : '#60a5fa',
          border: `1px solid ${role === 'interviewer' ? 'rgba(249,115,22,0.3)' : 'rgba(96,165,250,0.3)'}`,
          padding: '2px 10px', borderRadius: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {role === 'interviewer' ? '🎙 Interviewer' : '💻 Interviewee'}
        </span>
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function InterviewPage() {
  const [screen, setScreen] = useState<Screen>('lobby');
  const [role, setRole] = useState<'interviewer' | 'interviewee' | null>(null);
  const [mode, setMode] = useState<InterviewMode>('full');
  const [roomCode, setRoomCode] = useState('');
  const [qIdx, setQIdx] = useState(0);
  const [language, setLanguage] = useState<Language>('JavaScript');

  // HR round
  const [hrQIdx, setHrQIdx] = useState(0);
  const [hrAnswers, setHrAnswers] = useState<Record<string, string>>({});
  const [hrNotes, setHrNotes] = useState('');

  // Technical round
  const [codeMap, setCodeMap] = useState<Record<Language, string>>({
    JavaScript: '', Python: '', Java: '', 'C++': '',
  });
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState<LeftTab>('problem');
  const [hintIdx, setHintIdx] = useState(-1);
  const [testResults, setTestResults] = useState<('pass' | 'fail' | null)[]>([]);
  const [testRunning, setTestRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    problemSolving: 0, codeQuality: 0, communication: 0, timeManagement: 0,
  });

  const hrTimer = useTimer(20 * 60);
  const techTimer = useTimer(45 * 60);

  const q = QUESTIONS[qIdx];
  const hrQ = HR_QS[hrQIdx];

  function generateCode() {
    setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase());
  }

  function enterInterview() {
    if (!role || !roomCode) return;
    const initial: Record<Language, string> = {
      JavaScript: q.starterCode.JavaScript,
      Python: q.starterCode.Python,
      Java: q.starterCode.Java,
      'C++': q.starterCode['C++'],
    };
    setCodeMap(initial);
    setTestResults(q.testCases.map(() => null));
    setHintIdx(-1);
    setTab('problem');
    setSubmitted(false);
    setShowSubmitModal(false);
    if (mode === 'full') {
      setHrQIdx(0);
      setScreen('hr');
      hrTimer.reset();
      hrTimer.start();
    } else {
      setScreen('technical');
      techTimer.reset();
      techTimer.start();
    }
  }

  function proceedToTechnical() {
    hrTimer.pause();
    setScreen('technical');
    techTimer.reset();
    techTimer.start();
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
    if (!submitted) {
      setSubmitted(true);
      techTimer.pause();
    }
    setShowSubmitModal(true);
  }

  function leaveRoom() {
    hrTimer.reset();
    techTimer.reset();
    setScreen('lobby');
    setSubmitted(false);
    setShowSubmitModal(false);
  }

  const passedTests = testResults.filter(r => r === 'pass').length;
  const timeTakenMin = Math.max(0, Math.floor((45 * 60 - techTimer.seconds) / 60));

  // ── LOBBY ───────────────────────────────────────────────────────────────────
  if (screen === 'lobby') return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Nav />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px 60px' }}>

        <div style={{ marginBottom: 32 }}>
          <span className="section-label">Mock Interview Sandbox</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 6 }}>P2P Interview Room</h1>
          <p style={{ color: '#555', fontSize: 13, marginTop: 6, lineHeight: 1.7 }}>
            Practice with a partner — one person interviews, one answers. Full Interview includes an HR round before the technical question.
          </p>
        </div>

        {/* Interview Mode */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Interview Mode</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              ['full', '🎯', 'Full Interview', 'HR round (20 min) + Technical (45 min)'] as const,
              ['technical', '💻', 'Technical Only', 'Skip straight to the coding problem'] as const,
            ]).map(([m, icon, label, desc]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                background: mode === m ? 'rgba(249,115,22,0.1)' : '#222',
                border: mode === m ? '1px solid #f97316' : '1px solid #2a2a2a',
                borderRadius: 3, padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Role */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Your Role</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              ['interviewer', '🎙️', 'Interviewer', 'Ask questions, reveal hints, rate the candidate'] as const,
              ['interviewee', '💻', 'Interviewee', 'Answer HR questions and code the solution'] as const,
            ]).map(([r, icon, label, desc]) => (
              <button key={r} onClick={() => setRole(r)} style={{
                background: role === r ? 'rgba(249,115,22,0.1)' : '#222',
                border: role === r ? '1px solid #f97316' : '1px solid #2a2a2a',
                borderRadius: 3, padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Preferred Language</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setLanguage(l)} style={{
                flex: 1, background: language === l ? 'rgba(249,115,22,0.1)' : '#222',
                border: language === l ? '1px solid #f97316' : '1px solid #2a2a2a',
                borderRadius: 3, padding: '10px 6px', cursor: 'pointer',
                color: language === l ? '#f97316' : '#888',
                fontSize: 11, fontWeight: 700,
              }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Question selection */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Technical Question</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {QUESTIONS.map((q, i) => (
              <button key={q.id} onClick={() => setQIdx(i)} style={{
                background: qIdx === i ? 'rgba(249,115,22,0.08)' : '#222',
                border: qIdx === i ? '1px solid #f97316' : '1px solid #2a2a2a',
                borderRadius: 3, padding: '12px 16px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{q.title}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#555' }}>{q.topic}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: diffColor[q.difficulty], textTransform: 'uppercase' }}>{q.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Room code */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>Room Code</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB12CD"
              style={{ flex: 1, background: '#222', border: '1px solid #2a2a2a', borderRadius: 3, padding: '11px 14px', color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '0.15em', outline: 'none', fontFamily: 'monospace' }}
            />
            <button onClick={generateCode} style={{ background: '#2a2a2a', border: '1px solid #333', borderRadius: 3, padding: '11px 16px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
              Generate
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#444', marginTop: 6 }}>Share this code with your partner so you're on the same question.</p>
        </div>

        <button onClick={enterInterview} disabled={!role || !roomCode} style={{
          width: '100%',
          background: role && roomCode ? '#f97316' : '#2a2a2a',
          color: role && roomCode ? '#fff' : '#444',
          border: 'none', borderRadius: 3, padding: '14px',
          fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em',
          cursor: role && roomCode ? 'pointer' : 'not-allowed',
        }}>
          {mode === 'full' ? 'Start Interview →' : 'Enter Technical Room →'}
        </button>
      </div>
    </div>
  );

  // ── HR ROUND ─────────────────────────────────────────────────────────────────
  if (screen === 'hr') return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RoomBar label="HR Round" roomCode={roomCode} role={role} timer={hrTimer} onLeave={leaveRoom} />

      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '18px 0 0' }}>
        {HR_QS.map((_, i) => (
          <button key={i} onClick={() => setHrQIdx(i)} style={{
            width: i === hrQIdx ? 28 : 8, height: 8, borderRadius: 4, border: 'none',
            background: i < hrQIdx ? '#f97316' : i === hrQIdx ? '#f97316' : '#2a2a2a',
            opacity: i === hrQIdx ? 1 : i < hrQIdx ? 0.55 : 0.35,
            cursor: 'pointer', transition: 'all 0.3s', padding: 0,
          }} />
        ))}
        <span style={{ fontSize: 11, color: '#444', marginLeft: 8, fontWeight: 700 }}>
          {hrQIdx + 1} / {HR_QS.length}
        </span>
      </div>

      {/* Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: role === 'interviewer' ? '1fr 1fr' : '1fr',
        flex: 1,
        maxWidth: role === 'interviewer' ? 'none' : 740,
        margin: '0 auto',
        width: '100%',
        overflow: 'auto',
      }}>

        {/* Left — question + interviewee area */}
        <div style={{ padding: '32px 40px', borderRight: role === 'interviewer' ? '1px solid #222' : 'none' }}>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            Question {hrQIdx + 1} of {HR_QS.length}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.4, marginBottom: 12 }}>
            {hrQ.q}
          </h2>

          {hrQ.id === 'casestudy' ? (
            <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 4, padding: '16px 18px', marginBottom: 20, fontSize: 13, color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {hrQ.context}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75, marginBottom: 20 }}>{hrQ.context}</p>
          )}

          {/* Tips — shown to interviewee */}
          {role === 'interviewee' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a3a3a', marginBottom: 10 }}>Tips</div>
              {hrQ.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 }}>
                  <span style={{ color: '#f97316', fontSize: 11, marginTop: 3, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 12, color: '#555', lineHeight: 1.65 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {/* Draft area — interviewee */}
          {role === 'interviewee' && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a3a3a', marginBottom: 8 }}>
                Your Draft / Notes
              </div>
              <textarea
                value={hrAnswers[hrQ.id] || ''}
                onChange={e => setHrAnswers(prev => ({ ...prev, [hrQ.id]: e.target.value }))}
                placeholder="Jot down key points before you speak — structure your answer here..."
                style={{
                  width: '100%', minHeight: 160,
                  background: '#111', border: '1px solid #2a2a2a', borderRadius: 3,
                  padding: '14px 16px', color: '#ccc', fontSize: 13,
                  lineHeight: 1.75, fontFamily: 'system-ui, sans-serif',
                  outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Navigation */}
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

        {/* Right — interviewer panel */}
        {role === 'interviewer' && (
          <div style={{ padding: '32px 40px', overflow: 'auto' }}>
            <div style={{ fontSize: 11, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 22 }}>Interviewer Panel</div>

            {/* What to look for */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#444', marginBottom: 10 }}>What to Look For</div>
              {hrQ.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 }}>
                  <span style={{ color: '#f97316', fontSize: 11, marginTop: 3, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 12, color: '#555', lineHeight: 1.65 }}>{tip}</span>
                </div>
              ))}
            </div>

            {/* Follow-ups */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#444', marginBottom: 10 }}>Probe Deeper</div>
              {hrQ.followUps.map((fq, i) => (
                <div key={i} style={{ background: '#222', border: '1px solid #2a2a2a', borderRadius: 3, padding: '12px 14px', marginBottom: 6 }}>
                  <div style={{ fontSize: 10, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', marginBottom: 5 }}>Probe {i + 1}</div>
                  <div style={{ fontSize: 13, color: '#ccc', fontStyle: 'italic' }}>"{fq}"</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#444', marginBottom: 8 }}>Interviewer Notes</div>
              <textarea
                value={hrNotes}
                onChange={e => setHrNotes(e.target.value)}
                placeholder="Note observations about the candidate's communication, depth, structure..."
                style={{
                  width: '100%', minHeight: 140,
                  background: '#111', border: '1px solid #2a2a2a', borderRadius: 3,
                  padding: '14px 16px', color: '#888', fontSize: 13,
                  lineHeight: 1.7, fontFamily: 'system-ui, sans-serif',
                  outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── TECHNICAL ROUND ───────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RoomBar label="Technical Round" roomCode={roomCode} role={role} timer={techTimer} onLeave={leaveRoom} />

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>

        {/* LEFT — problem panel */}
        <div style={{ borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>{q.title}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: diffColor[q.difficulty], textTransform: 'uppercase' }}>{q.difficulty}</span>
            <span style={{ fontSize: 10, color: '#444' }}>{q.topic}</span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #222' }}>
            {(['problem', ...(role === 'interviewer' ? ['hints', 'followups'] : [])] as LeftTab[]).map(t => (
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

          {/* Tab content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
            {tab === 'problem' && (
              <pre style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#aaa', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
                {q.problem}
              </pre>
            )}

            {tab === 'hints' && role === 'interviewer' && (
              <div>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>Reveal hints one at a time when the interviewee is stuck.</p>
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

            {tab === 'followups' && role === 'interviewer' && (
              <div>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>Ask these after the interviewee finishes their solution.</p>
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

          {/* Language tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #222', flexShrink: 0 }}>
            {LANGUAGES.map(l => (
              <button key={l} onClick={() => setLanguage(l)} style={{
                flex: 1, background: language === l ? '#1a1a1a' : '#111',
                border: 'none', borderRight: '1px solid #222',
                borderBottom: language === l ? '2px solid #f97316' : '2px solid transparent',
                color: language === l ? '#fff' : '#555',
                padding: '10px 6px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                transition: 'color 0.15s',
              }}>
                {l}
              </button>
            ))}
          </div>

          {/* Code textarea */}
          <textarea
            value={codeMap[language]}
            onChange={e => setCodeMap(prev => ({ ...prev, [language]: e.target.value }))}
            spellCheck={false}
            style={{
              flex: 1,
              background: '#0d0d0d',
              color: '#e2e8f0',
              border: 'none', outline: 'none',
              padding: '18px 22px',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 13, lineHeight: 1.9,
              resize: 'none', minHeight: 220,
            }}
          />

          {/* Test cases panel */}
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
              {submitted && (
                <button onClick={() => setShowSubmitModal(true)} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 3, padding: '6px 14px', color: '#4ade80', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                  ✓ View Results
                </button>
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

          {/* Notes / scratch pad */}
          <div style={{ borderTop: '1px solid #222', flexShrink: 0 }}>
            <div style={{ padding: '8px 18px', background: '#111', borderBottom: '1px solid #1e1e1e' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {role === 'interviewer' ? 'Interviewer Notes' : 'Scratch Pad / Approach'}
              </span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={role === 'interviewer' ? 'Observe and note down your assessment...' : 'Plan your approach before coding — think out loud here...'}
              style={{
                width: '100%', height: 80, background: '#1a1a1a',
                color: '#666', border: 'none', outline: 'none',
                padding: '12px 18px', fontFamily: 'system-ui, sans-serif',
                fontSize: 12, lineHeight: 1.7, resize: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* Submit / Results Modal */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '36px 40px', maxWidth: 500, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>

            <div style={{ fontSize: 11, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Solution Submitted
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{q.title}</h2>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>
              Time taken:&nbsp;<span style={{ color: '#fff', fontWeight: 700 }}>{timeTakenMin} min</span>
              &nbsp;·&nbsp;Language:&nbsp;<span style={{ color: '#fff', fontWeight: 700 }}>{language}</span>
            </p>

            {/* Test results */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '18px 20px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 14 }}>Test Results</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
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
              {testResults.some(r => r !== null) ? (
                <div style={{ fontSize: 26, fontWeight: 900, color: passedTests === q.testCases.length ? '#4ade80' : passedTests > 0 ? '#fbbf24' : '#f87171' }}>
                  {passedTests}/{q.testCases.length} tests passed
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#444' }}>No tests run — click Run Tests first to see results.</div>
              )}
            </div>

            {/* Interviewer rating */}
            {role === 'interviewer' && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#444', letterSpacing: '0.08em', marginBottom: 14 }}>Rate the Candidate</div>
                {([
                  ['problemSolving', 'Problem Solving'],
                  ['codeQuality', 'Code Quality'],
                  ['communication', 'Communication'],
                  ['timeManagement', 'Time Management'],
                ] as [RatingKey, string][]).map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#777', minWidth: 140 }}>{label}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setRatings(prev => ({ ...prev, [key]: star }))} style={{
                          width: 28, height: 28,
                          background: ratings[key] >= star ? 'rgba(249,115,22,0.2)' : '#222',
                          border: `1px solid ${ratings[key] >= star ? '#f97316' : '#333'}`,
                          borderRadius: 3, cursor: 'pointer',
                          fontSize: 11, fontWeight: 800,
                          color: ratings[key] >= star ? '#f97316' : '#444',
                        }}>
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setShowSubmitModal(false)} style={{
              width: '100%', background: '#222', border: '1px solid #333', borderRadius: 3,
              padding: '12px', color: '#fff', cursor: 'pointer', fontSize: 12,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
