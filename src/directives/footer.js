import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-3 border-t dark:border-white/10 bg-white dark:bg-bgdark" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"  >
        <p className="text-center" >
           ©  {new Date().getFullYear()} <a style={{color: 'blue'}}>Apurva Electrical Admin Panel</a>. Restricted Area
        </p>
      </div>
    </footer>
  );
};
export default Footer;
