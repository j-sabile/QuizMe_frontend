import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Award, BarChart3, BookOpen, Calendar, Clock, Edit3, Target, Trophy, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Quiz } from "@/interfaces/IQuiz";
import type { IUser } from "@/interfaces/IUser";
import createQuiz from "@/utils/createQuiz";

const Account = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/users/${userId}`, { credentials: "include" });
      if (!res.ok) return alert("Something went wrong. Please try again later.");
      const data = await res.json();
      setUser(data.user);
    };
    load();
  }, []);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) return `${minutes}m ${seconds}s`;
    else return `${seconds}s`;
  };

  if (!user) return;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-start gap-4 sm:gap-8 mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.username}</h1>
                <Button variant="outline" size="sm" className="text-base px-4 py-2">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-2xl">{user.bio}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base sm:text-lg text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(user.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {user.quizzesTakenCount} Quizzes Completed
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-blue-50 rounded-2xl p-3 sm:p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-base font-semibold text-blue-900">Average Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{user.aveScorePercent}%</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-3 sm:p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                <span className="text-base font-semibold text-green-900">Quizzes Taken</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{user.quizzesTakenCount}</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-3 sm:p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="text-base font-semibold text-purple-900">Quizzes Created</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{user.quizzesCreatedCount}</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 sm:p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-orange-600" />
                <span className="text-base font-semibold text-orange-900">Total Attempts</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{user.quizzesTakenCount}</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-gray-100 rounded-2xl gap-2 max-w-[500px]">
            <TabsTrigger
              value="overview"
              className="text-lg py-1 sm:py-2 px-2 rounded-xl break-words whitespace-normal text-center data-[state=active]:bg-white"
            >
              Quiz Records
            </TabsTrigger>
            <TabsTrigger
              value="created"
              className="text-lg py-1 sm:py-2 px-2 rounded-xl break-words whitespace-normal text-center data-[state=active]:bg-white"
            >
              Created Quizzes
            </TabsTrigger>
            {/* <TabsTrigger
              value="settings"
              className="text-lg py-2 px-2 rounded-xl break-words whitespace-normal text-center data-[state=active]:bg-white"
            >
              Settings
            </TabsTrigger> */}
          </TabsList>

          {/* Quiz Records Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quiz Records</h2>
              <p className="text-base text-end text-gray-600">{user.quizzesTakenCount} quizzes completed</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {user.quizzesTaken.map((record) => (
                <div key={record.id}>
                  <Link to={`/result/${record.id}`}>
                    <div key={record.id} className="bg-gray-50 rounded-2xl p-4 sm:p-8 border-2 border-gray-200 hover:bg-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{(record.quizId as Quiz).title}</h3>
                          {(record.quizId as Quiz).type.map((type) => (
                            <Badge variant="outline" className="text-base px-3 py-1" key={type}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={`text-base sm:text-lg px-4 py-2 ${getScoreBadgeColor(Math.floor((record.score / record.questions.length) * 100))}`}>
                          {Math.floor((record.score / record.questions.length) * 100)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6 text-base sm:text-lg">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Target className="w-5 h-5" />
                          <span>
                            {record.score}/{record.questions.length} correct
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <span>{formatDuration(record.durationSeconds)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-5 h-5" />
                          <span>{new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(record.dateTaken)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Created Quizzes Tab */}
          <TabsContent value="created" className="space-y-6">
            <div className="flex items-center justify-between mb-8 gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Created Quizzes</h2>
              <Button onClick={() => createQuiz(navigate)} size="lg" className="text-base sm:text-lg px-6 py-3">
                Create Quiz
              </Button>
            </div>

            <div className="space-y-6">
              {user.quizzesCreated.map((quiz) => (
                <div>
                  <Link to={`/quiz/${quiz.id}`}>
                    <div key={quiz.id} className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:bg-gray-100">
                      <div className="flex items-start justify-between ">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                          <p className="text-lg text-gray-600 mb-4 leading-relaxed">{quiz.shortDescription}</p>
                          {quiz.type.map((type) => (
                            <Badge variant="outline" className="text-base px-3 py-1" key={type}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-right">
                          {/* <div className="text-2xl font-bold text-blue-600 mb-1">{quiz.attempts}</div> */}
                          {/* <div className="text-lg text-gray-600">attempts</div> */}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="flex items-center gap-3 text-gray-600">
                          <BookOpen className="w-5 h-5" />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-5 h-5" />
                          <span>Created {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(quiz.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* <div className="flex gap-4 mt-6">
                    <Button variant="outline" className="text-base px-4 py-2">
                      Edit Quiz
                    </Button>
                    <Button variant="outline" className="text-base px-4 py-2">
                      View Analytics
                    </Button>
                  </div> */}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          {/* <TabsContent value="settings" className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Settings</h2>
              <p className="text-lg text-gray-600">Manage your account preferences and privacy settings</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-lg font-semibold text-gray-700 mb-2 block">Username</label>
                    <div className="text-xl text-gray-900">alex_johnson</div>
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-700 mb-2 block">Email</label>
                    <div className="text-xl text-gray-900">alex.johnson@example.com</div>
                  </div>
                  <Button className="text-lg px-6 py-3">Update Profile</Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Email Notifications</div>
                      <div className="text-base text-gray-600">Receive updates about new quizzes and results</div>
                    </div>
                    <Button variant="outline" className="text-base px-4 py-2">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Privacy Settings</div>
                      <div className="text-base text-gray-600">Control who can see your quiz results</div>
                    </div>
                    <Button variant="outline" className="text-base px-4 py-2">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );

  // return (
  //   <div className="flex flex-col justify-start items-start gap-8 max-w-[1080px] w-full h-full mx-auto p-4">
  //     {userId}

  //     <div>{user.username}</div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //   </div>
  // );
};

export default Account;
