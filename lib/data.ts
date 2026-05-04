export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "DSA",
    question: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: 1,
    difficulty: "easy"
  },
  {
    id: 2,
    category: "DSA",
    question: "Which data structure uses LIFO (Last In, First Out) order?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    answer: 2,
    difficulty: "easy"
  },
  {
    id: 3,
    category: "DSA",
    question: "What does BFS use internally?",
    options: ["Stack", "Queue", "Priority Queue", "Deque"],
    answer: 1,
    difficulty: "medium"
  },
  {
    id: 4,
    category: "DBMS",
    question: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: 2,
    difficulty: "easy"
  },
  {
    id: 5,
    category: "DBMS",
    question: "What does ACID stand for in databases?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Access, Control, Index, Data",
      "Atomicity, Control, Integrity, Durability",
      "Access, Consistency, Isolation, Data"
    ],
    answer: 0,
    difficulty: "medium"
  },
  {
    id: 6,
    category: "OS",
    question: "What is a deadlock in operating systems?",
    options: [
      "When CPU is idle",
      "When two or more processes wait indefinitely for each other",
      "When memory is full",
      "When a process crashes"
    ],
    answer: 1,
    difficulty: "medium"
  },
  {
    id: 7,
    category: "OS",
    question: "Which scheduling algorithm gives CPU to process with shortest burst time next?",
    options: ["FCFS", "Round Robin", "SJF", "Priority"],
    answer: 2,
    difficulty: "medium"
  },
  {
    id: 8,
    category: "DSA",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    answer: 2,
    difficulty: "hard"
  },
  {
    id: 9,
    category: "Aptitude",
    question: "If a train travels 60 km in 45 minutes, what is its speed in km/h?",
    options: ["75 km/h", "80 km/h", "90 km/h", "70 km/h"],
    answer: 1,
    difficulty: "easy"
  },
  {
    id: 10,
    category: "Aptitude",
    question: "What is 15% of 240?",
    options: ["32", "36", "40", "38"],
    answer: 1,
    difficulty: "easy"
  }
];

export const CONCEPT_VAULT = {
  DSA: [
    {
      title: "Arrays & Strings",
      icon: "📊",
      level: "Beginner",
      resources: [
        { type: "video", label: "Striver — Arrays Playlist", url: "https://youtube.com/playlist?list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB" },
        { type: "practice", label: "LeetCode Array Problems", url: "https://leetcode.com/tag/array/" },
        { type: "article", label: "GeeksForGeeks Arrays", url: "https://www.geeksforgeeks.org/array-data-structure/" }
      ],
      topics: ["Two Pointers", "Sliding Window", "Prefix Sum", "Kadane's Algorithm"]
    },
    {
      title: "Linked Lists",
      icon: "🔗",
      level: "Beginner",
      resources: [
        { type: "video", label: "Striver — Linked List Series", url: "https://youtube.com/playlist?list=PLgUwDviBIf0r47RKH7A7EBPizGFKyQoEf" },
        { type: "practice", label: "LeetCode LinkedList", url: "https://leetcode.com/tag/linked-list/" }
      ],
      topics: ["Reversal", "Cycle Detection (Floyd's)", "Merge Sort", "Fast & Slow Pointers"]
    },
    {
      title: "Trees & Graphs",
      icon: "🌳",
      level: "Intermediate",
      resources: [
        { type: "video", label: "William Fiset — Graph Theory", url: "https://youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P" },
        { type: "video", label: "Striver — Trees Playlist", url: "https://youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk" },
        { type: "practice", label: "LeetCode Tree Problems", url: "https://leetcode.com/tag/tree/" }
      ],
      topics: ["BFS", "DFS", "Dijkstra", "Topological Sort", "Union-Find"]
    },
    {
      title: "Dynamic Programming",
      icon: "⚡",
      level: "Advanced",
      resources: [
        { type: "video", label: "Aditya Verma — DP Playlist", url: "https://youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go" },
        { type: "video", label: "Striver — DP Series", url: "https://youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY" },
        { type: "practice", label: "LeetCode DP Problems", url: "https://leetcode.com/tag/dynamic-programming/" }
      ],
      topics: ["Memoization", "Tabulation", "Knapsack", "LCS", "Matrix Chain"]
    }
  ],
  DBMS: [
    {
      title: "SQL Fundamentals",
      icon: "🗄️",
      level: "Beginner",
      resources: [
        { type: "video", label: "Giraffe Academy — SQL Course", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
        { type: "practice", label: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" },
        { type: "article", label: "W3Schools SQL", url: "https://www.w3schools.com/sql/" }
      ],
      topics: ["SELECT, JOIN, GROUP BY", "Subqueries", "Indexes", "Views"]
    },
    {
      title: "Normalization & Transactions",
      icon: "🔄",
      level: "Intermediate",
      resources: [
        { type: "video", label: "Gate Smashers — DBMS", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y" },
        { type: "article", label: "1NF to BCNF Explained", url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/" }
      ],
      topics: ["1NF, 2NF, 3NF, BCNF", "ACID Properties", "Concurrency Control", "Deadlocks"]
    }
  ],
  OS: [
    {
      title: "Process & Scheduling",
      icon: "⚙️",
      level: "Intermediate",
      resources: [
        { type: "video", label: "Gate Smashers — OS Playlist", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p" },
        { type: "article", label: "Process Scheduling GeeksForGeeks", url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/" }
      ],
      topics: ["FCFS", "SJF", "Round Robin", "Priority Scheduling", "Gantt Charts"]
    },
    {
      title: "Memory Management",
      icon: "🧠",
      level: "Advanced",
      resources: [
        { type: "video", label: "Neso Academy — OS", url: "https://youtube.com/playlist?list=PLBlnK6fEyqRjT3oJxI4P7eHE4MhV2KXoU" },
        { type: "article", label: "Paging & Segmentation", url: "https://www.geeksforgeeks.org/paging-in-operating-system/" }
      ],
      topics: ["Paging", "Segmentation", "Virtual Memory", "Page Replacement Algorithms"]
    }
  ]
};

export const SPRINT_TASKS: Record<string, { easy: any[]; medium: any[]; hard: any[] }> = {
  DSA: {
    easy: [
      { title: "Two Sum", platform: "LeetCode #1", url: "https://leetcode.com/problems/two-sum/", time: "20 min", concept: "Hash Map" },
      { title: "Reverse String", platform: "LeetCode #344", url: "https://leetcode.com/problems/reverse-string/", time: "10 min", concept: "Two Pointers" },
      { title: "Valid Parentheses", platform: "LeetCode #20", url: "https://leetcode.com/problems/valid-parentheses/", time: "15 min", concept: "Stack" }
    ],
    medium: [
      { title: "Longest Substring Without Repeating", platform: "LeetCode #3", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", time: "30 min", concept: "Sliding Window" },
      { title: "Add Two Numbers (LL)", platform: "LeetCode #2", url: "https://leetcode.com/problems/add-two-numbers/", time: "25 min", concept: "Linked List" },
      { title: "Number of Islands", platform: "LeetCode #200", url: "https://leetcode.com/problems/number-of-islands/", time: "35 min", concept: "BFS/DFS" }
    ],
    hard: [
      { title: "Median of Two Sorted Arrays", platform: "LeetCode #4", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", time: "45 min", concept: "Binary Search" },
      { title: "Trapping Rain Water", platform: "LeetCode #42", url: "https://leetcode.com/problems/trapping-rain-water/", time: "40 min", concept: "Two Pointers/Stack" }
    ]
  },
  DBMS: {
    easy: [
      { title: "Select All Employees", platform: "HackerRank", url: "https://www.hackerrank.com/domains/sql", time: "10 min", concept: "SELECT" },
      { title: "Revising the SELECT Query", platform: "HackerRank SQL", url: "https://www.hackerrank.com/challenges/revising-the-select-query/problem", time: "10 min", concept: "WHERE clause" }
    ],
    medium: [
      { title: "ACID Properties Quiz", platform: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/quiz-on-acid-properties/", time: "15 min", concept: "Transactions" },
      { title: "Normalization Practice", platform: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/", time: "25 min", concept: "3NF/BCNF" }
    ],
    hard: [
      { title: "Complex Join Query", platform: "LeetCode #184", url: "https://leetcode.com/problems/department-highest-salary/", time: "30 min", concept: "JOIN + Subquery" }
    ]
  },
  OS: {
    easy: [
      { title: "FCFS Scheduling Simulation", platform: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/program-for-fcfs-cpu-scheduling/", time: "15 min", concept: "CPU Scheduling" }
    ],
    medium: [
      { title: "Banker's Algorithm", platform: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system/", time: "30 min", concept: "Deadlock Avoidance" },
      { title: "Page Replacement Algorithms", platform: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/", time: "25 min", concept: "Virtual Memory" }
    ],
    hard: [
      { title: "Semaphores & Mutex", platform: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/semaphores-in-process-synchronization/", time: "35 min", concept: "Synchronization" }
    ]
  },
  Aptitude: {
    easy: [
      { title: "Time & Work Problems", platform: "IndiaBix", url: "https://www.indiabix.com/aptitude/time-and-work/", time: "15 min", concept: "Arithmetic" },
      { title: "Percentage Problems", platform: "IndiaBix", url: "https://www.indiabix.com/aptitude/percentage/", time: "15 min", concept: "Percentages" }
    ],
    medium: [
      { title: "Probability Questions", platform: "IndiaBix", url: "https://www.indiabix.com/aptitude/probability/", time: "20 min", concept: "Probability" }
    ],
    hard: [
      { title: "Data Interpretation Set", platform: "IndiaBix", url: "https://www.indiabix.com/data-interpretation/questions-and-answers/", time: "30 min", concept: "DI" }
    ]
  }
};

export const COMPANIES = [
  { name: "Google", type: "Product", cgpa: 7.0, package: "45 LPA", deadline: "2025-08-15", logo: "G" },
  { name: "Microsoft", type: "Product", cgpa: 6.5, package: "35 LPA", deadline: "2025-07-20", logo: "M" },
  { name: "Amazon", type: "Service+Product", cgpa: 6.0, package: "28 LPA", deadline: "2025-07-10", logo: "A" },
  { name: "Infosys", type: "Service", cgpa: 6.0, package: "6.5 LPA", deadline: "2025-06-30", logo: "I" },
  { name: "TCS", type: "Service", cgpa: 6.0, package: "7 LPA", deadline: "2025-06-25", logo: "T" },
  { name: "Wipro", type: "Service", cgpa: 6.0, package: "6.5 LPA", deadline: "2025-07-05", logo: "W" },
  { name: "Flipkart", type: "Product", cgpa: 7.5, package: "40 LPA", deadline: "2025-09-01", logo: "F" },
  { name: "Razorpay", type: "Startup", cgpa: 7.0, package: "25 LPA", deadline: "2025-08-01", logo: "R" },
];
