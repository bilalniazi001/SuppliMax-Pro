import Header from '../../components/UI-UX/common/Header';
import Footer from '../../components/UI-UX/common/Footer';
import '../globals.css';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}