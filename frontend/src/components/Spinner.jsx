import {PropagateLoader} from "react-spinners"

const Spinner = () => {
  return (
    // <div className='animate-ping w-16 h-16 m-8 rounded-full bg-sky-600'></div>
    <div className="flex h-screen justify-center items-center">
      <PropagateLoader color="#e99e15" />
    </div>
  )
}

export default Spinner;