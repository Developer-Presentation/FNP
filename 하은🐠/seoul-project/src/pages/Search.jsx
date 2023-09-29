import {useState} from "react";
import seoulProjectApi from "../API/seoulProjectApi";
import SearchIcon from "../asset/img/search.png";

return (
  <>
    <SearchContents>
      <SearchPart />
      <SearchIcon src={SearchIcon} alt="검색" />
    </SearchContents>
  </>
);
export default Search;
