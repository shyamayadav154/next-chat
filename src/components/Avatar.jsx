function Avatar({ name }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
      <span className="font-medium leading-none text-sm text-white">
        {name[0]?.toUpperCase()}
      </span>
    </span>
  );
}

export default Avatar