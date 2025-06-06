import SubmitPublicationForm from "@/components/publication/publication-form";
import { cookies } from 'next/headers';

const SubmitPublicationPage = async () => {

  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  return (
    <div className="container mx-auto py-10">
      <SubmitPublicationForm userId={userId} />
    </div>
  );
};

export default SubmitPublicationPage;
