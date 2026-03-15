export default function Footer() {
    return (
        <footer className="text-center py-8 px-6 text-sm bg-gray-800 text-white">
            © {new Date().getFullYear()} Expense Tracker. Todos los derechos reservados.
        </footer>
    )
}
