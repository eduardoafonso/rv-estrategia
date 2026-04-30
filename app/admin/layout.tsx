export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex" }}>
            <aside style={{ width: 200, background: "#eee" }}>
                <p>Menu Admin</p>
            </aside>

            <main style={{ padding: 20 }}>{children}</main>
        </div>
    );
}