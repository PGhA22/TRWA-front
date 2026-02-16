export default function Checkbox({
  id,
  onChange,
  className = "",
}) {
  return (
    <input
      id={id}
      type="checkbox"
      onChange={onChange}
      className={`
        flex items-center justify-center
        appearance-none box-border
        w-4 h-4
        bg-[#000080]
        border-5 border-[#5A7ACD]
        rounded-full
        checked:bg-[#5A7ACD]
        checked:after:content-['\\2713']
        after:text-xs
        ${className}
      `}
    />
  );
}
