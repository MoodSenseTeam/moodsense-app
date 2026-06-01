function AuthInput({ id, name, label, type = "text", placeholder, value, onChange, className = "" }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[#1f3f31]">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-2 h-14 w-full rounded-2xl border border-transparent bg-[#eef3ef] px-5 text-base text-[#1f3f31] outline-none transition placeholder:text-[#7f8f86] focus:border-[#2b6a4f] focus:bg-white sm:h-16 sm:px-6 ${className}`}
      />
    </div>
  );
}

export default AuthInput;
