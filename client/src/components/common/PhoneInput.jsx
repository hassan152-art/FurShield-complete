// A plain <input> that only accepts digits and stops at 11 characters —
// used anywhere we collect a phone/contact number.
export default function PhoneInput({ value, onChange, placeholder = "03XXXXXXXXX", className = "", required = false }) {
  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
    onChange(digitsOnly);
  };

  return (
    <input
      type="tel"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={11}
      required={required}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
