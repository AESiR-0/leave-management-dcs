export default function Page() {
  return (
    <div className="h-screen  w-screen flex justify-center items-center">
      <div className="flex">
        <div className="">
          <div className="h-6 w-[3px] bg-black"></div>
          <div className="flex items-start justify-start">
            <div className="h-[3px] w-6 bg-black"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6  h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
