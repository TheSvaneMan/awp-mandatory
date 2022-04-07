import { Link } from 'remix';

export default function custom404Page() {
    return (
        <div>
            <div  className='h-max bg-slate-900 rounded-lg animate-bounce p-4 my-10'>
                <h1>404: Page does not exist</h1>
            </div>
            <div>
                 <Link to="/" className="ml-3 transition hover:bg-blue-500 bg-blue-600 p-4 rounded-lg">
                    Return to Home
                </Link>
            </div>
        </div>
    )
}