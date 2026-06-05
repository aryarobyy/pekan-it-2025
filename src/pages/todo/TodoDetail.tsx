import { useState } from 'react'
import TodoTile from '../../components/todo/TodoTile';

//final kalo ada subtask

const TodoDetail = () => {
  const [todoChecked, setTodoChecked] = useState(false);
  const toDateKey = (date: Date) => date.toISOString().split("T")[0]; 

  return (
        <div className="flex bg-center justify-center items-center min-h-screen mt-10">
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 md:mt-10 rounded-2xl sm:rounded-3xl bg-[#4E7B97] py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-7xl">
            <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 sm:mb-6 md:mb-8 font-medium">
              Web Development
            </h1>
            {toDoItemData.map((p) => (
              <TodoTile
                key={p.id}
                isChecked={p.isChecked}
                label={p.label}
                date={toDateKey(new Date(p.date))}
                id={Number(p.id)}
                color={"cyan"}
                onChange={setTodoChecked}
              />
            ))}
          </div>
        </div>
  )
}

const toDoItemData = [
  {
    id: "1",
    isChecked: false,
    label: "Mengerjakan Desain UI/UX Aplikasi Mobile",
    date: new Date(2025, 0, 15),
  },
  {
    id: "2",
    isChecked: true,
    label: "Revisi Laporan Keuangan Tahunan",
    date: new Date(2025, 1, 28),
  },
  {
    id: "3",
    isChecked: false,
    label: "Menyiapkan Presentasi untuk Rapat Mingguan",
    date: new Date(2025, 2, 10),
  },
  {
    id: "4",
    isChecked: false,
    label: "Mengembangkan Fitur Login di Website",
    date: new Date(2025, 3, 5),
  },
  {
    id: "5",
    isChecked: true,
    label: "Melakukan Review Kode untuk Modul Pembayaran",
    date: new Date(2024, 11, 20),
  },
  {
    id: "6",
    isChecked: false,
    label: "Mempelajari Bahasa Pemrograman Python Dasar",
    date: new Date(2025, 4, 12),
  },
  {
    id: "7",
    isChecked: false,
    label: "Menulis Artikel Blog tentang Teknologi Terbaru",
    date: new Date(2025, 5, 30),
  },
  {
    id: "8",
    isChecked: true,
    label: "Membeli Perlengkapan Kantor Baru",
    date: new Date(2024, 9, 1),
  },
];

export default TodoDetail