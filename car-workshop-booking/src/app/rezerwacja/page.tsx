import BookingForm from '@/components/client/BookingForm';

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                        Rezerwacja <span className="text-yellow-500">Wizyty</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-zinc-400 mx-auto">
                        Wybierz termin z kalendarza i zgłoś usterkę swojego samochodu. Nasz zespół zajmie się resztą.
                    </p>
                </div>

                <BookingForm />
            </div>
        </div>
    );
}
