/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ./경로/**/*.{확장명} => 경로에 있는 모든 폴더(**)의 모든 파일(*)중 확장명에 해당하는 파일에 적용시키겠다는 뜻
    "./pages/**/*.{js, jsx, ts, tsx}",
    "./components/**/*.{js, jsx, ts, tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
