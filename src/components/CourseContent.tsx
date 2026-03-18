import parse from "html-react-parser";

interface Lesson {
  content: string;
}

interface CourseContentProps {
  lesson: Lesson;
}

const CourseContent: React.FC<CourseContentProps> = ({ lesson }) => {
  return (
    <div className="prose max-w-none">
      {parse(lesson.content)}
    </div>
  );
};

export default CourseContent;