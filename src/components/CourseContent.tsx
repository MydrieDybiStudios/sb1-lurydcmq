import React from "react";
import parse from "html-react-parser";
import MiniQuest from "./MiniQuest";

const CourseContent = ({ lesson }) => {
  return (
    <div className="prose max-w-none">
      {parse(lesson.content)}
      {lesson.quiz && <MiniQuest quiz={lesson.quiz} />}
    </div>
  );
};

export default CourseContent;