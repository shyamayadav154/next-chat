export default function FormInput(props) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block font-medium  text-gray-900 sm:text-sm sm:leading-6"
      >
        {props?.label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...props}
        />
      </div>
    </div>
  );
}
