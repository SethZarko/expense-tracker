export const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <>
      <footer>
        <small>Seth Zarkovich Web Dev {year}&copy;</small>
      </footer>
    </>
  );
};
