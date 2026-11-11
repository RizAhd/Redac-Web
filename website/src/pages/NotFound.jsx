import { Center } from './ThankYou.jsx';
import { Btn } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <Center>
      <h1 className="h1" data-split data-now>Page not <span className="accent accent--light">found</span></h1>
      <p className="lead" data-reveal>The page you are looking for has moved or does not exist.</p>
      <div className="btn-row btn-row--center" data-reveal><Btn to="/" variant="white">Back to home</Btn></div>
    </Center>
  );
}
