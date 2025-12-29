interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <div className="rounded-md p-4">
      <div className="py-4 px-6 flex justify-between items-center border-b bg-grayd rounded-md border-gray-300 mb-4">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="bg-grayd shadow-lg rounded-md p-2 space-y-3.5">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
