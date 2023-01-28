import Auth from "./micro/Auth"
import Profil from "./micro/Profil"

let Sidebar = (props) => {
    if(props.status === 'login'){
        return (
            <Profil status={props.setStatus} />
        )
    }else {
        return (
            <Auth cek={props.status} status={props.setStatus} />
        )
    }
}


export default Sidebar;