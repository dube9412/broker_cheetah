import React from "react";
import { Link } from "react-router-dom";
import lessons from "../data/lessons";
import resources from "../data/resources";

function HardMoneyClass() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hard Money Lending Class</h1>
      <p className="mb-4">Learn everything you need to know about hard money lending, from the basics to advanced strategies.</p>
      
      <h2 className="text-xl font-bold mt-6">Modules</h2>
      <ul className="list-disc ml-6">
        {lessons.map((lesson, index) => (
          <li key={index} className="mb-2">
            <Link to={`/hard-money-class/${lesson.id}`} className="text-blue-500 hover:underline">
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
      
      <h2 className="text-xl font-bold mt-6">Downloadable Resources</h2>
      <ul className="list-disc ml-6">
        {resources.map((resource, index) => (
          <li key={index} className="mb-2">
            <a href={resource.url} className="text-blue-500 hover:underline" download>
              {resource.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HardMoneyClass;

