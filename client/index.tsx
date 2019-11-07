import {h, render, FunctionalComponent} from 'preact'
import Router from 'preact-router'

const Home: FunctionalComponent = () => (
    <div>
        <h1>hogehoge</h1>
        <p>piyopiyo</p>
    </div>
)

interface TestProps {
    param?: string;
}

const Test: FunctionalComponent<TestProps> = ({ param }: TestProps) => (
    <div>
        <h1>test</h1>
        <p>{ param }</p>
    </div>
)

const App: FunctionalComponent = () => (
    <Router>
        <Home path="/" />
        <Test path="/test/:param" />
    </Router>
)

render(<App />, document.getElementById('app'))
