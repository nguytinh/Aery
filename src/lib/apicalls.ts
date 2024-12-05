export default function get_base_url(){
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000'
    } else {
        return process.env.HOST_URL
    }
}