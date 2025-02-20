import React from "react";
import { useParams, Link } from "react-router-dom";
import lessons from "../data/lessons";

function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessons.find(l => l.id === lessonId);

  if (!lesson) {
    return <div className="p-6">❌ Lesson not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p className="mb-4">🚀 Lesson content for {lesson.title} will go here.</p>
      <p>{lesson.content}</p> {/* ✅ Lesson content now displays */}

      <Link to="/hard-money-class" className="text-blue-500 hover:underline">
        ← Back to Class
      </Link>
    </div>
  );
}

export default LessonPage;
