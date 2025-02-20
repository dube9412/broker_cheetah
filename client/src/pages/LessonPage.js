import React, { lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import lessons from "../data/lessons";

function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessons.find(l => l.id === lessonId);

  if (!lesson) {
    return <div className="p-6">❌ Lesson not found.</div>;
  }

  // Dynamically import the correct module based on lessonId
  const ModuleComponent = lazy(() => import(`../pages/modules/${lessonId}`));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <Suspense fallback={<p>Loading lesson...</p>}>
        <ModuleComponent /> {/* ✅ This will load the correct module dynamically */}
      </Suspense>

      <Link to="/hard-money-class" className="text-blue-500 hover:underline">
        ← Back to Class
      </Link>
    </div>
  );
}

export default LessonPage;

