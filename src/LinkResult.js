import axios from "axios";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const LinkResult = ({ inputValue }) => {
  const [shortenLink, setShortenLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!inputValue) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        let url = inputValue.trim();

        // make sure URL is valid
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }

        // CORS proxy
        const proxy = "https://api.allorigins.win/get?url=";
        const target = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(
          url
        )}`;

        const res = await axios.get(proxy + encodeURIComponent(target));

        // allorigins wraps output in { contents: "..." }
        setShortenLink(res.data.contents);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [inputValue]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (loading) return <p className="noData">Loading...</p>;
  if (error) return <p className="noData">Something went wrong :(</p>;

  return (
    <>
      {shortenLink && (
        <div className="result">
          <p>{shortenLink}</p>
          <CopyToClipboard text={shortenLink} onCopy={() => setCopied(true)}>
            <button className={copied ? "copied" : ""}>Copy to Clipboard</button>
          </CopyToClipboard>
        </div>
      )}
    </>
  );
};

export default LinkResult;
