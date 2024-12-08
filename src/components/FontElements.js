

export function Input({ id, labelText, register, type, errors, rules, placeholder }) {
  const { name, onChange, onBlur, ref } = register(id, rules);

  return (
    <>
      <label htmlFor={id} className="form-label">
        {labelText}
      </label>
      <input
        placeholder={placeholder}
        id={id}
        type={type}
        className={`form-control ${errors[id] && "is-invalid"}`}
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
      />
      {errors[id] && (
        <div className="invalid-feedback">{errors[id]?.message}</div>
      )}
    </>
  );
}
export function Textarea({ id, labelText, register, type, errors, rules, placeholder }) {
  const { name, onChange, onBlur, ref } = register(id, rules);

  return (
    <>
      <label htmlFor={id} className="form-label">
        {labelText}
      </label>
      <textarea
        placeholder={placeholder}
        id={id}
        type={type}
        className={`form-control ${errors[id] && "is-invalid"}`}
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
      />
      {errors[id] && (
        <div className="invalid-feedback">{errors[id]?.message}</div>
      )}
    </>
  );
}

