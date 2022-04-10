import styled from "styled-components"
import StoneScene from "../../components/Scenes/StoneScene"
import Day from "./day.jpg"

function Home() {
  return (
    <Holder>
      {/* <img src={Day}></img> */}
      <StoneScene />
    </Holder>
  )
}

export default Home

const Holder = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #111111;
`
