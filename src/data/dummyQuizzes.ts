import type { Quiz } from "../interfaces/IQuiz";

const dummyQuizzes: Quiz[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "World Capitals Quiz",
    shortDescription: "Test your capital city knowledge!",
    longDescription:
      "Challenge yourself with this quiz on world capitals. Can you name the capital of countries from every continent? From Paris to Canberra, prove your geography skills.",
    image: "https://picsum.photos/id/222/400",
    ownerUsername: "geoGuru",
    createdAt: new Date("2024-10-01T10:00:00Z"),
  },
  {
    id: "b2c3d4e5-f678-9012-abcd-ef2345678901",
    title: "Science Trivia Challenge",
    shortDescription: "Explore fascinating science facts.",
    longDescription:
      "Dive into this science quiz covering physics, biology, chemistry, and more. From atoms to galaxies, test how much you really know about the universe.",
    image: "https://picsum.photos/id/221/400",
    ownerUsername: "scienceWhiz",
    createdAt: new Date("2024-11-15T09:30:00Z"),
  },
  {
    id: "c3d4e5f6-7890-1234-abcd-ef3456789012",
    title: "History of Art Quiz",
    shortDescription: "Discover the art of the ages.",
    longDescription:
      "From the Renaissance to modern art movements, this quiz explores the most iconic works and artists in history. Test your knowledge of masterpieces and the stories behind them.",
    image: "https://picsum.photos/id/220/400",
    ownerUsername: "artHistorian88",
    createdAt: new Date("2024-12-01T14:45:00Z"),
  },
  {
    id: "d4e5f678-9012-3456-abcd-ef4567890123",
    title: "Pop Culture Showdown",
    shortDescription: "How well do you know pop culture?",
    longDescription:
      "Movies, music, and celebrities—this quiz is packed with questions about the biggest moments and figures in pop culture history. Are you a true fan?",
    image: "https://picsum.photos/id/219/400",
    ownerUsername: "popFanatic",
    createdAt: new Date("2025-01-10T16:20:00Z"),
  },
  {
    id: "e5f67890-1234-5678-abcd-ef5678901234",
    title: "Tech & Innovation Test",
    shortDescription: "Explore the world of modern tech.",
    longDescription: "From smartphones to AI, test your knowledge of the latest breakthroughs, trends, and inventions that are shaping our world.",
    image: "https://picsum.photos/id/218/400",
    ownerUsername: "techSavvy007",
    createdAt: new Date("2025-03-05T08:15:00Z"),
  },
];

export default dummyQuizzes;
