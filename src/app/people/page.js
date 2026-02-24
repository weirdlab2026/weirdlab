import Link from "next/link";

export default function People() {
    return (
        <div>
            <h1>People</h1>
            <Link href="/people/edit">편집</Link>
        </div>
    );
}