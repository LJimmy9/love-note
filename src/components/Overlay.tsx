import overlay from './Overlay.module.css';

interface OverlayProps{
    Name: string
    Avatar:string
}

function Overlay({Name, Avatar}: OverlayProps) {
    return (
    <div className = {overlay.names}>
        {Name}
    <div className = {overlay.avatars}>
    <svg width="50" height='50'>
      <image xlinkHref={Avatar} width="50" height="50" />
      </svg>
      </div>
      </div>  
    )
}

export default Overlay

// <div className = {overlay.avatars}>vvvv
//         {Avatar}</div>