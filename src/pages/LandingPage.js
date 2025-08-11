import React, { useState, useEffect } from "react";

export default function DSAQuestionTracker() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [tempNote, setTempNote] = useState("");

  // Initial static data
const dataFiles = {
  dsa: {
    filename: "dsa_questions.json",
    questions: [
      { id: "dsa_1", title: "Reverse a linked list", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_2", title: "Merge two sorted linked lists", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_3", title: "Find the middle of a linked list", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_4", title: "Detect cycle in a linked list", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_5", title: "Remove nth node from end of linked list", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_6", title: "Implement a stack using queues", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_7", title: "Implement a queue using stacks", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_8", title: "Find the intersection of two linked lists", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_9", title: "Rotate a linked list", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_10", title: "Add two numbers represented by linked lists", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_11", title: "Implement a min stack", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_12", title: "Validate binary search tree", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_13", title: "Inorder traversal of a binary tree", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_14", title: "Preorder traversal of a binary tree", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_15", title: "Postorder traversal of a binary tree", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_16", title: "Level order traversal of a binary tree", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_17", title: "Maximum depth of a binary tree", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_18", title: "Lowest common ancestor in a binary tree", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_19", title: "Construct binary tree from preorder and inorder traversal", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_20", title: "Serialize and deserialize a binary tree", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_21", title: "Find the kth smallest element in a BST", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_22", title: "Merge k sorted lists", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_23", title: "Implement a trie (prefix tree)", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_24", title: "Longest valid parentheses", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_25", title: "Implement a min heap", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_26", title: "Find median from data stream", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_27", title: "Merge intervals", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_28", title: "Meeting rooms II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_29", title: "Top K frequent elements", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_30", title: "Kth largest element in an array", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_31", title: "Find peak element", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_32", title: "Search in rotated sorted array", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_33", title: "Find first and last position of element in sorted array", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_34", title: "Median of two sorted arrays", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_35", title: "Longest consecutive sequence", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_36", title: "Two sum", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_37", title: "Three sum", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_38", title: "Four sum", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_39", title: "Container with most water", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_40", title: "Trapping rain water", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_41", title: "Longest substring without repeating characters", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_42", title: "Longest palindromic substring", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_43", title: "Regular expression matching", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_44", title: "Wildcard matching", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_45", title: "Minimum window substring", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_46", title: "Word ladder", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_47", title: "Word ladder II", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_48", title: "Clone graph", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_49", title: "Course schedule", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_50", title: "Course schedule II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_51", title: "Number of islands", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_52", title: "Surrounded regions", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_53", title: "Word search", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_54", title: "Word search II", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_55", title: "Pacific Atlantic water flow", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_56", title: "Longest increasing path in a matrix", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_57", title: "Rotate image", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_58", title: "Spiral matrix", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_59", title: "Set matrix zeroes", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_60", title: "Game of life", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_61", title: "Implement LRU cache", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_62", title: "Implement LFU cache", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_63", title: "Design a data structure for add and search words", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_64", title: "Find duplicate subtrees", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_65", title: "Binary tree maximum path sum", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_66", title: "Path sum", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_67", title: "Path sum II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_68", title: "Path sum III", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_69", title: "Diameter of binary tree", status: "pending", notes: "", difficulty: "Easy" },
      { id: "dsa_70", title: "Longest univalue path", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_71", title: "House robber", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_72", title: "House robber II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_73", title: "House robber III", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_74", title: "Coin change", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_75", title: "Coin change 2", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_76", title: "Unique paths", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_77", title: "Unique paths II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_78", title: "Longest increasing subsequence", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_79", title: "Longest common subsequence", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_80", title: "Edit distance", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_81", title: "Decode ways", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_82", title: "Word break", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_83", title: "Word break II", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_84", title: "Partition equal subset sum", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_85", title: "Target sum", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_86", title: "Combination sum", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_87", title: "Combination sum II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_88", title: "Combination sum III", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_89", title: "Palindrome partitioning", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_90", title: "Subsets", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_91", title: "Subsets II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_92", title: "Permutations", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_93", title: "Permutations II", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_94", title: "Generate parentheses", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_95", title: "Letter combinations of a phone number", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_96", title: "N-Queens", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_97", title: "N-Queens II", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_98", title: "Sudoku solver", status: "pending", notes: "", difficulty: "Hard" },
      { id: "dsa_99", title: "Valid sudoku", status: "pending", notes: "", difficulty: "Medium" },
      { id: "dsa_100", title: "Group anagrams", status: "pending", notes: "", difficulty: "Medium" }
    ]
  },
  systemDesign: {
    filename: "system_design_questions.json",
    questions: [
      { id: "sd_1", title: "Design a URL shortening service", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_2", title: "Design a messaging system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_3", title: "Design a file storage system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_4", title: "Design a news feed system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_5", title: "Design a ride-sharing service", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_6", title: "Design a parking lot system", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_7", title: "Design a chat application", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_8", title: "Design an autocomplete system", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_9", title: "Design a web crawler", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_10", title: "Design a notification service", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_11", title: "Design a rate limiter", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_12", title: "Design a distributed key-value store", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_13", title: "Design a load balancer", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_14", title: "Design an online voting system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_15", title: "Design a movie ticket booking system", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_16", title: "Design a search engine", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_17", title: "Design a social media platform", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_18", title: "Design an e-commerce system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_19", title: "Design a logging system", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_20", title: "Design a recommendation system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_21", title: "Design a distributed lock manager", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_22", title: "Design an API gateway", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_23", title: "Design a task scheduler", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_24", title: "Design a content delivery network", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_25", title: "Design a distributed file system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_26", title: "Design an online code editor", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_27", title: "Design a traffic control system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_28", title: "Design a real-time analytics system", status: "pending", notes: "", difficulty: "Hard" },
      { id: "sd_29", title: "Design a hotel booking system", status: "pending", notes: "", difficulty: "Medium" },
      { id: "sd_30", title: "Design a distributed queue system", status: "pending", notes: "", difficulty: "Hard" }
    ]
  },
  oop: {
    filename: "oop_questions.json",
    questions: [
      { id: "oop_1", title: "Explain inheritance with an example", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_2", title: "Differentiate between composition and inheritance", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_3", title: "What is polymorphism? Provide examples", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_4", title: "Explain method overloading vs method overriding", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_5", title: "Design a singleton class", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_6", title: "What are abstract classes and interfaces?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_7", title: "Explain encapsulation with an example", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_8", title: "Design a factory pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_9", title: "Implement an observer pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_10", title: "Explain SOLID principles", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_11", title: "Design a strategy pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_12", title: "What is dependency injection?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_13", title: "Explain the concept of abstraction", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_14", title: "Design a decorator pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_15", title: "What is the difference between aggregation and composition?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_16", title: "Explain the adapter pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_17", title: "Design a command pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_18", title: "What is the purpose of the final keyword?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_19", title: "Explain the concept of immutable objects", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_20", title: "Design a builder pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_21", title: "What are the benefits of using interfaces?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_22", title: "Explain the concept of method hiding", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_23", title: "Design a template method pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_24", title: "What is the difference between shallow and deep copying?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_25", title: "Explain the concept of association", status: "pending", notes: "", difficulty: "Easy" },
      { id: "oop_26", title: "Design a state pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_27", title: "What are the advantages of using abstract classes?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_28", title: "Explain the concept of cohesion and coupling", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_29", title: "Design a chain of responsibility pattern", status: "pending", notes: "", difficulty: "Medium" },
      { id: "oop_30", title: "What is the purpose of access modifiers?", status: "pending", notes: "", difficulty: "Easy" }
    ]
  },
  general: {
    filename: "general_questions.json",
    questions: [
      { id: "gen_1", title: "Explain the difference between process and thread", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_2", title: "What is deadlock and how to prevent it?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_3", title: "Explain REST vs SOAP", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_4", title: "What is the difference between SQL and NoSQL databases?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_5", title: "How does garbage collection work in Java?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_6", title: "Explain microservices architecture", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_7", title: "What is the difference between monolithic and microservices architecture?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_8", title: "Explain the concept of multithreading", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_9", title: "What is a race condition and how to avoid it?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_10", title: "Explain the CAP theorem", status: "pending", notes: "", difficulty: "Hard" },
      { id: "gen_11", title: "What is the difference between HTTP and HTTPS?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_12", title: "Explain how DNS works", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_13", title: "What is the difference between TCP and UDP?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_14", title: "Explain the concept of load balancing", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_15", title: "What is a reverse proxy?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_16", title: "Explain the concept of caching", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_17", title: "What is the difference between horizontal and vertical scaling?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_18", title: "Explain the concept of eventual consistency", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_19", title: "What is a circuit breaker pattern?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_20", title: "Explain the concept of database indexing", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_21", title: "What is normalization in databases?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_22", title: "Explain the difference between inner and outer joins", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_23", title: "What is a transaction in a database?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_24", title: "Explain ACID properties in databases", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_25", title: "What is a distributed system?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_26", title: "Explain the concept of sharding", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_27", title: "What is a message queue and its use cases?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_28", title: "Explain the concept of API versioning", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_29", title: "What is OAuth and how does it work?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_30", title: "Explain the concept of JWT (JSON Web Token)", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_31", title: "What is the difference between authentication and authorization?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_32", title: "Explain the concept of CORS", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_33", title: "What is a CDN and how does it work?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_34", title: "Explain the concept of eventual consistency in NoSQL", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_35", title: "What is the difference between a process and a container?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_36", title: "Explain the concept of Docker", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_37", title: "What is Kubernetes and its main components?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_38", title: "Explain the concept of CI/CD", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_39", title: "What is the difference between unit testing and integration testing?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_40", title: "Explain the concept of mocking in testing", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_41", title: "What is the difference between black-box and white-box testing?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_42", title: "Explain the concept of TDD (Test-Driven Development)", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_43", title: "What is a design pattern and why is it useful?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_44", title: "Explain the MVC architecture", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_45", title: "What is the difference between synchronous and asynchronous programming?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_46", title: "Explain the event loop in JavaScript", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_47", title: "What is a closure in programming?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_48", title: "Explain the concept of promises in JavaScript", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_49", title: "What is the difference between var, let, and const in JavaScript?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_50", title: "Explain the concept of garbage collection in Python", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_51", title: "What is the difference between a list and a tuple in Python?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_52", title: "Explain the concept of decorators in Python", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_53", title: "What is a lambda function in Python?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_54", title: "Explain the concept of virtual environments in Python", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_55", title: "What is the difference between shallow and deep cloning in Java?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_56", title: "Explain the concept of reflection in Java", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_57", title: "What is the difference between checked and unchecked exceptions in Java?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_58", title: "Explain the concept of generics in Java", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_59", title: "What is the difference between ArrayList and LinkedList in Java?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_60", title: "Explain the concept of dependency injection in Spring", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_61", title: "What is the difference between RESTful and REST API?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_62", title: "Explain the concept of idempotency in APIs", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_63", title: "What is the difference between PUT and PATCH in HTTP?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_64", title: "Explain the concept of circuit breaker in microservices", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_65", title: "What is the difference between monolithic and SOA architectures?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_66", title: "Explain the concept of eventual consistency in distributed systems", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_67", title: "What is the difference between a gateway and a router?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_68", title: "Explain the concept of service discovery", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_69", title: "What is the difference between a proxy and a reverse proxy?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_70", title: "Explain the concept of load shedding", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_71", title: "What is the difference between stateless and stateful applications?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_72", title: "Explain the concept of blue-green deployment", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_73", title: "What is the difference between canary and rolling deployments?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_74", title: "Explain the concept of circuit breaker in distributed systems", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_75", title: "What is the difference between a semaphore and a mutex?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_76", title: "Explain the concept of thread pool", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_77", title: "What is the difference between a stack and a heap?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_78", title: "Explain the concept of memory leaks", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_79", title: "What is the difference between compile-time and runtime?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_80", title: "Explain the concept of lazy loading", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_81", title: "What is the difference between a framework and a library?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_82", title: "Explain the concept of inversion of control", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_83", title: "What is the difference between a process and a service?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_84", title: "Explain the concept of database connection pooling", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_85", title: "What is the difference between a stored procedure and a function?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_86", title: "Explain the concept of database triggers", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_87", title: "What is the difference between a view and a materialized view?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_88", title: "Explain the concept of database partitioning", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_89", title: "What is the difference between a primary key and a foreign key?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_90", title: "Explain the concept of database denormalization", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_91", title: "What is the difference between a hash table and a hash map?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_92", title: "Explain the concept of consistent hashing", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_93", title: "What is the difference between a binary tree and a binary search tree?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_94", title: "Explain the concept of red-black trees", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_95", title: "What is the difference between a B-tree and a B+ tree?", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_96", title: "Explain the concept of bloom filters", status: "pending", notes: "", difficulty: "Medium" },
      { id: "gen_97", title: "What is the difference between a stack and a queue?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_98", title: "Explain the concept of priority queues", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_99", title: "What is the difference between a graph and a tree?", status: "pending", notes: "", difficulty: "Easy" },
      { id: "gen_100", title: "Explain the concept of topological sorting", status: "pending", notes: "", difficulty: "Medium" }
    ]
  }
};

  useEffect(() => {
    const savedData = localStorage.getItem("questionsData");
    if (savedData) {
      setQuestions(JSON.parse(savedData));
      setLoading(false);
    } else {
      loadQuestionsFromFiles();
    }
  }, []);

  function loadQuestionsFromFiles() {
    setLoading(true);
    try {
      const allQuestions = [
        ...dataFiles.dsa.questions.map(q => ({ ...q, section: "DSA" })),
        ...dataFiles.systemDesign.questions.map(q => ({ ...q, section: "System Design" })),
        ...dataFiles.oop.questions.map(q => ({ ...q, section: "OOP" })),
        ...dataFiles.general.questions.map(q => ({ ...q, section: "General" }))
      ];
      setQuestions(allQuestions);
      localStorage.setItem("questionsData", JSON.stringify(allQuestions)); // store initial data
      setLoading(false);
    } catch (err) {
      setError("Error loading question files");
      setLoading(false);
    }
  }

  function updateQuestionInFile(questionId, updates) {
    setQuestions(prev => {
      const updated = prev.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      );
      localStorage.setItem("questionsData", JSON.stringify(updated)); // save to localStorage
      return updated;
    });
  }

  function toggleStatus(id) {
    const question = questions.find(q => q.id === id);
    const newStatus = question.status === "completed" ? "pending" : "completed";
    updateQuestionInFile(id, { status: newStatus });
  }

  function saveNote(id) {
    updateQuestionInFile(id, { notes: tempNote });
    setEditingNote(null);
    setTempNote("");
  }

  function startEditNote(question) {
    setEditingNote(question.id);
    setTempNote(question.notes);
  }

  function cancelEditNote() {
    setEditingNote(null);
    setTempNote("");
  }

  function exportUpdatedFiles() {
    const sections = {
      "DSA": questions.filter(q => q.section === "DSA"),
      "System Design": questions.filter(q => q.section === "System Design"),
      "OOP": questions.filter(q => q.section === "OOP"),
      "General": questions.filter(q => q.section === "General")
    };

    Object.entries(sections).forEach(([sectionName, sectionQuestions]) => {
      const jsonContent = JSON.stringify(sectionQuestions, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sectionName.toLowerCase().replace(' ', '_')}_questions.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function getDifficultyColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  const sections = ["all", ...new Set(questions.map(q => q.section))];
  const filteredQuestions = questions.filter(q => {
    const matchesSection = selectedSection === "all" || q.section === selectedSection;
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesStatus && matchesSearch;
  });

  const stats = {
    total: questions.length,
    completed: questions.filter(q => q.status === "completed").length,
    pending: questions.filter(q => q.status === "pending").length,
    bySection: sections.slice(1).reduce((acc, section) => {
      const sectionQuestions = questions.filter(q => q.section === section);
      acc[section] = {
        total: sectionQuestions.length,
        completed: sectionQuestions.filter(q => q.status === "completed").length
      };
      return acc;
    }, {})
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
          DSA Question Tracker
        </h1>
        <p className="text-slate-600 mb-6">Track your progress on interview prep</p>
      </header>

      {/* Controls */}
      <section className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Question Manager</h2>
          <div className="flex gap-3">
            <button onClick={loadQuestionsFromFiles} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              🔄 Reset to Default
            </button>
            <button onClick={exportUpdatedFiles} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              💾 Export Updated Files
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Section:</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 rounded-lg border">
              {sections.map(section => (
                <option key={section} value={section}>
                  {section === "all" ? "All Sections" : section}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-3 py-2 rounded-lg border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Questions List */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        {filteredQuestions.map((question) => (
          <div key={question.id} className={`p-5 mb-4 rounded-xl border ${question.status === "completed" ? 'border-green-200 bg-green-50' : 'border-slate-200'}`}>
            <div className="flex justify-between">
              <div>
                <div className="flex gap-3 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 rounded-full text-sm">{question.section}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(question.difficulty)}`}>{question.difficulty}</span>
                  <span className="text-xs text-slate-500">ID: {question.id}</span>
                </div>
                <h3 className={`text-lg font-medium ${question.status === "completed" ? 'text-green-700' : ''}`}>{question.title}</h3>
                {editingNote === question.id ? (
                  <div className="mt-2">
                    <textarea className="w-full px-3 py-2 border rounded-lg" rows="3" value={tempNote} onChange={(e) => setTempNote(e.target.value)} />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveNote(question.id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                      <button onClick={cancelEditNote} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    {question.notes ? <p className="bg-slate-50 p-3 rounded-lg">{question.notes}</p> : <p className="text-slate-400 italic">No notes yet</p>}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => toggleStatus(question.id)} className={`px-4 py-2 rounded-lg ${question.status === "completed" ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {question.status === "completed" ? '✅ Completed' : '⏳ Mark Complete'}
                </button>
                <button onClick={() => startEditNote(question)} className="px-3 py-2 rounded-lg bg-slate-100">
                  📝 {question.notes ? 'Edit Note' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
