//using https://formsubmit.co/ for the contact form
export default function ContactPage() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-[80vw]">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

          <p className="mb-6 text-gray-700 text-lg">
            Have questions, feedback, or ideas? We'd love to hear from you. Fill
            out the form below or email us directly.
          </p>

          <form
            className="space-y-6 text-left"
            action="https://formsubmit.co/crpiggottburner@gmail.com"
            method="POST"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="box" />
            <input
              type="hidden"
              name="_autoresponse"
              value="Thanks for reaching out! We'll be in touch shortly."
            />

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder="How can we help you?"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
