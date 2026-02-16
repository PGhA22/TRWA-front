export default function FormInput({
  parentClassName = "",
  wrapperClassName = "",
  inputProps = {},
  inputClassName = "",
  icon = null,
  errorId,
  errorClassName = "",
  errorText = null,
}) {
  return (
    <div
      className={`flex flex-row gap-2 w-10/12 max-w-md relative ${parentClassName}`}
    >
      <div
        className={`in-glass-border-ch glass-border-ch in-gradient-border gradient-border rounded-4xl  flex-1 min-w-1 ${wrapperClassName}`}
      >
        <input
          {...inputProps}
          className={`glass-input border-none w-full px-3 py-3 2xl:py-3.5 rounded-4xl outline-none text-white backdrop-blur-sm bg-radial from-60% from-transparent to-black/10 ${inputClassName}`}
        />
        {icon}
      </div>
      <span
        id={errorId}
        className={`hidden m-0 text-[#ff0000] -bottom-4 mt-px left-5 absolute font-extralight ${errorClassName}`}
      >
        {errorText}
      </span>
    </div>
  );
}
