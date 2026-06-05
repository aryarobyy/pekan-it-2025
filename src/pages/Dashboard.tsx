import dashboardBg from "../assets/images/dashboardBg.png";
import imgRight from "../assets/images/dbItem1.png";
import { MyButton } from "../components/Button";
import find from "../assets/icons/findIcon.png";
import clock from "../assets/icons/clockIcon.png";
import chat from "../assets/icons/chatIcon.png";
import note from "../assets/icons/noteIcon.png";
import star from "../assets/icons/starIcon.png";
import profilePic from "../assets/images/profile.png";

const testimonialsData = [
  {
    id: 1,
    content:
      "Dulu aku susah banget cari teman buat diskusi tugas, tapi di aplikasi ini aku nemu study group yang cocok. Belajar jadi lebih seru dan nggak bosen! Fitur to-do list bareng-nya juga bantu banget buat ngerjain proyek.",
    jurusan: "Mahasiswa Ilmu Komputer",
    profile: profilePic,
    name: "Baskara",
    isSelected: false,
  },
  {
    id: 2,
    content:
      "Dulu aku susah banget cari teman buat diskusi tugas, tapi di aplikasi ini aku nemu study group yang cocok. Belajar jadi lebih seru dan nggak bosen! Fitur to-do list bareng-nya juga bantu banget buat ngerjain proyek.",
    jurusan: "Mahasiswa Ilmu Komputer",
    profile: profilePic,
    name: "Baskara",
    isSelected: false,
  },
  {
    id: 3,
    content:
      "Dulu aku susah banget cari teman buat diskusi tugas, tapi di aplikasi ini aku nemu study group yang cocok. Belajar jadi lebih seru dan nggak bosen! Fitur to-do list bareng-nya juga bantu banget buat ngerjain proyek.",
    jurusan: "Mahasiswa Ilmu Komputer",
    profile: profilePic,
    name: "Baskara",
    isSelected: false,
  },
  {
    id: 4,
    content:
      "Dulu aku susah banget cari teman buat diskusi tugas, tapi di aplikasi ini aku nemu study group yang cocok. Belajar jadi lebih seru dan nggak bosen! Fitur to-do list bareng-nya juga bantu banget buat ngerjain proyek.",
    jurusan: "Mahasiswa Ilmu Komputer",
    profile: profilePic,
    name: "Baskara",
    isSelected: false,
  },
  {
    id: 5,
    content:
      "Dulu aku susah banget cari teman buat diskusi tugas, tapi di aplikasi ini aku nemu study group yang cocok. Belajar jadi lebih seru dan nggak bosen! Fitur to-do list bareng-nya juga bantu banget buat ngerjain proyek.",
    jurusan: "Mahasiswa Ilmu Komputer",
    profile: profilePic,
    name: "Baskara",
    isSelected: false,
  },
  {
    id: 6,
    content:
      "Dulu aku susah banget cari teman buat diskusi tugas, tapi di aplikasi ini aku nemu study group yang cocok. Belajar jadi lebih seru dan nggak bosen! Fitur to-do list bareng-nya juga bantu banget buat ngerjain proyek.",
    jurusan: "Mahasiswa Ilmu Komputer",
    profile: profilePic,
    name: "Baskara",
    isSelected: false,
  },
];

export const Dashboard = () => {
  return (
    <>
      <div
        className={`w-full h-screen bg-cover bg-center flex items-center justify-center pt-16`}
        style={{ backgroundImage: `url(${dashboardBg})` }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-12 py-8">
          <div className="flex-1 max-w-lg md:mr-16 mb-8 md:mb-0 text-center md:text-left font-helvetica">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Sulit fokus sendiri?
            </h1>
            <p className="text-white text-base sm:text-lg mb-6 leading-relaxed">
              Temukan partner belajarmu, jadwalkan sesi Pomodoro, dan selesaikan
              to-do list bersama. Raih target belajarmu lebih cepat!
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              Find your friends
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <img
              src={imgRight}
              alt="Dashboard Item"
              className="max-w-full h-auto object-contain w-3/4 md:w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row p-10 justify-center items-center bg-center">
          <MyButton
            text={"Mulai Sekarang"}
            variant="accent"
            className="w-75 h-25 m-4 text-xl sm:m-8 sm:text-[1.5rem]"
          />
          <MyButton
            text={"Lanjutkan"}
            variant="accent"
            className="w-75 h-25 m-4 text-xl sm:m-8 sm:text-[1.5rem]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-center p-3">
        <h1 className="text-white text-2xl m-5">Siap Tingkatkan Belajarmu?</h1>
        <div className="flex flex-wrap justify-center gap-20 max-w-4xl mx-auto">
          <ItemBackground
            image={find}
            title="Temukan partner belajarmu sesuai minat"
          />
          <ItemBackground
            image={chat}
            title="Temukan partner belajarmu sesuai minat"
          />
          <ItemBackground
            image={note}
            title="Temukan partner belajarmu sesuai minat"
          />
          <ItemBackground
            image={clock}
            title="Temukan partner belajarmu sesuai minat"
          />
          <ItemBackground image={star} title="Selesaikan tugas dengan mudah" />
        </div>
      </div>

      <div className="relative mt-20 w-full flex justify-center">
        <div className="w-full h-[30rem] bg-primary/70 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-[25rem] sm:w-[30rem] md:w-[40rem] lg:w-[45rem] h-20 bg-tertiary rounded-3xl flex items-center justify-center transition-all duration-300 ease-in-out">
            <h2 className="text-white text-3xl font-bold font-sans tracking-wide">
              Apa Kata Mereka?
            </h2>
          </div>

          <div
            className="flex flex-row gap-8 px-10 pt-28 pb-10 overflow-x-auto overflow-y-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonialsData.map((testimonial) => (
              <div key={testimonial.id} className="flex-none">
                <TestimonialCard
                  content={testimonial.content}
                  jurusan={testimonial.jurusan}
                  profile={testimonial.profile}
                  name={testimonial.name}
                  isSelected={testimonial.isSelected}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

type ItemBackgroundProps = {
  image: string;
  title: string;
};

const ItemBackground: React.FC<ItemBackgroundProps> = ({ image, title }) => {
  return (
    <div className="flex flex-col justify-center items-center w-60">
      <div
        className="relative w-32 h-32 rounded-full border border-gray-200 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, #ffffff 0%, #f8f9fa 40%, #e9ecef 70%, #dee2e6 100%)",
          boxShadow: `
            0 16px 32px rgba(0, 0, 0, 0.4),
            0 8px 16px rgba(0, 0, 0, 0.25),
            0 4px 8px rgba(0, 0, 0, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.8),
            inset 0 -3px 0 rgba(0, 0, 0, 0.12),
            inset -8px -8px 16px rgba(0, 0, 0, 0.08),
            inset 8px 8px 16px rgba(255, 255, 255, 0.4),
            inset -4px 4px 8px rgba(0, 0, 0, 0.05)
          `,
        }}
      >
        <div className="p-3">
          <img src={image} alt="" className="w-full h-full" />
        </div>
      </div>
      <h1 className="text-white font-helvetica mt-6 text-lg text-center">
        {title}
      </h1>
    </div>
  );
};

type TestimonialCardProps = {
  content: string;
  name: string;
  jurusan: string;
  profile: string;
  isSelected?: boolean;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  name,
  jurusan,
  profile,
  isSelected = false,
}) => {
  return (
    <div
      className={`
        h-[18rem] w-[22rem] text-white bg-primary
        flex flex-col justify-between rounded-xl p-6
        ${
          isSelected
            ? "border-2 border-highlight"
            : "border-2 border-transparent"
        }
        relative
      `}
    >
      {isSelected && (
        <div className="absolute bottom-[-2.5rem] left-1/2 transform -translate-x-1/2 w-0.5 h-10 border-l-2 border-dashed border-gray-400"></div>
      )}

      <div>
        <p className="font-sans text-base leading-snug tracking-tight">
          {content}
        </p>
      </div>

      <div className="flex flex-row items-center gap-3 mt-4">
        <img
          src={profile}
          alt={`Profil ${name}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg mb-0.5">{name}</h1>
          <p className="text-sm text-gray-300">{jurusan}</p>
        </div>
      </div>
    </div>
  );
};
