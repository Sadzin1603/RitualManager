export function Loader({ loading = true, size = 80 }) {
    if (!loading) return null;

    return (
        <img
            src="src/assets/loader.png"
            alt="carregando"
            style={{
                width: size,
                height: size,
                objectFit: "contain",
            }}
        />
    );
}