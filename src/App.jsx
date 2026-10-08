import { useState } from "react";

// Replace this placeholder with the webhook URL copied from your n8n workflow.
const WEBHOOK_URL = "http://localhost:5000/api/submit";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  city: "",
  college: "",
  courseOrRole: "",
  skills: "",
  message: "",
};

const inputClassName =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  ...props
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClassName}
        {...props}
      />
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (status.message) setStatus({ type: "", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const payload = { ...formData };
    console.log("User details payload:", payload);
    setIsSubmitting(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`The webhook returned an error (${response.status}).`);
      }

      setFormData(emptyForm);
      setStatus({ type: "success", message: "Details submitted successfully!" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? `Could not submit your details. ${error.message} Check your webhook URL and try again.`
            : "Could not submit your details. Check your webhook URL and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/70 via-slate-50 to-slate-100 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
            >
              <path
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            n8n webhook practice
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            User Details Form
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
            Share a few details below. Your form data will be sent securely to your n8n
            webhook.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-slate-200/70">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-9">
            <h2 className="font-semibold text-slate-900">Your information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fields marked with <span className="text-rose-500">*</span> are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 px-6 py-7 sm:px-9 sm:py-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full Name"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="e.g. Alex Morgan"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
              />
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="e.g. +1 555 123 4567"
              />
              <Field
                label="Age"
                name="age"
                type="number"
                min="0"
                max="150"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 24"
              />

              <div>
                <label htmlFor="gender" className="text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`${inputClassName} appearance-none`}
                >
                  <option value="">Select an option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <Field
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Seattle"
              />
              <Field
                label="College / Organization"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Where you study or work"
              />
              <Field
                label="Course / Role"
                name="courseOrRole"
                value={formData.courseOrRole}
                onChange={handleChange}
                placeholder="e.g. Computer Science student"
              />
            </div>

            <Field
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Design, JavaScript, project management"
            />

            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Anything else you would like to share?"
                className={`${inputClassName} resize-y`}
              />
            </div>

            {status.message && (
              <p
                role={status.type === "error" ? "alert" : "status"}
                className={`rounded-xl px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-rose-50 text-rose-800"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit details"}
            </button>
            <p className="-mt-4 text-center text-xs text-slate-400">
              Your information is sent to the configured n8n webhook.
            </p>
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          Learning tip: open your browser&apos;s developer console to inspect the submitted
          JSON payload.
        </p>
      </div>
    </main>
  );
}
