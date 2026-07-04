import { TailSpin } from "react-loader-spinner";

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <TailSpin
        height={70}
        width={70}
        color="#2563eb"
        visible={true}
      />
    </div>
  );
}

export default Loader;