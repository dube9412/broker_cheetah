import React from "react";
import { useParams, Link } from "react-router-dom";
import lessons from "../data/lessons";
import Module1 from "../pages/modules/Module1";
import Module2 from "../pages/modules/Module2";
import Module3 from "../pages/modules/Module3";
import Module4 from "../pages/modules/Module4";
import Module5 from "../pages/modules/Module5";
import Module6 from "../pages/modules/Module6";
import Module7 from "../pages/modules/Module7";

const moduleComponents = {
  "module-1": Module1,
  "module-2": Module2,
  "module-3": Module3,
  "module-4": Module4,
  "module-5": Module5,
  "module-6": Module6,
  "module-7": Module7,
};

function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  const ModuleComponent = moduleComponents[lessonId];

  if (!lesson || !ModuleComponent) {
    return <div className="p-6">❌ Lesson not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <ModuleComponent />
      <Link to="/hard-money-class" className="text-blue-500 hover:underline">
        ← Back to Class
      </Link>
    </div>
  );
}

export default LessonPage;

