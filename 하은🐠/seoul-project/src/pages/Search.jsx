import React, {useState, useRef} from "react";
import {styled} from "styled-components";
import seoulProjectApi from "../API/seoulProjectApi";
import searchIcon from "../asset/img/search.png";
// import Search from "./Search";

const Search = () => {
  //검색어 관리 하는 애
  const [searchTerm, setSearchTerm] = useState("");
  //검색 결과를 관리 하는애
  const [searchResults, setSearchResults] = useState([]);
  const {getSeoulList} = seoulProjectApi();
  const searchTimeoutRef = useRef(null);
  const [ResultsVisible, setResultsVisible] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value;
    //검색어를 setSearchTerm 상태에 업데이트 하고 검색요청을 보냄
    setSearchTerm(term);
    // 검색어가 변경될 때마다 타이머를 리셋하여 500ms 이후에 검색 요청
    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchResults(term);
    }, 500);
  };

  //검색 결과를 위한 함수
  const fetchSearchResults = async (term) => {
    try {
      // 검색어가 비어있을 때만 초기화
      if (term === "") {
        setSearchResults([]);
        setResultsVisible(false);
        return;
      }
      const data = await getSeoulList(0, term);
      setSearchResults(data);
      setResultsVisible(true);
      console.log(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <>
      <SearchBox>
        <SearchContents>
          <SearchPart placeholder="검색어를 입력하세요" type="text" value={searchTerm} onChange={handleSearch} />
          <button type="button">
            <SearchIcon src={searchIcon} alt="검색" />
          </button>
        </SearchContents>
        {ResultsVisible && (
          <SearchResults>
            {searchResults.row?.length > 0 ? (
              searchResults.row.map((item, index) => (
                <div key={index}>
                  <h3 className="searchTitle">{item.TITLE}</h3>
                </div>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </SearchResults>
        )}
      </SearchBox>
    </>
  );
};

const SearchBox = styled.div`
  width: 60%;
  padding: 0px 20px;
  margin: 0 auto;
`;
const SearchContents = styled.div`
  border: 1px solid grey;
  border-radius: 10px;
  padding: 15px;
  width: 100%;
  margin: 0 auto 20px;
  display: flex;
  justify-content: space-between;
`;
const SearchPart = styled.input`
  width: 100%;
  outline: none;
`;
const SearchIcon = styled.img`
  width: 20px;
  margin-left: 10px;
`;
const SearchResults = styled.div`
  border: 1px solid grey;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  padding: 10px;
  margin-top: -10px;

  .searchTitle {
    font-size: 14px;
    padding: 3px 0;
    font-weight: 400;
  }
`;

export default Search;
