// frontend/components/AuthForm.jsx
const AuthForm = () => (
  <form className="bg-white p-8 rounded shadow-md">
    <h2 className="text-2xl mb-4">Login</h2>
    <input type="email" placeholder="Email" className="w-full p-2 mb-2 border" />
    <input type="password" placeholder="Password" className="w-full p-2 mb-4 border" />
    <button className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
  </form>
);
export default AuthForm;