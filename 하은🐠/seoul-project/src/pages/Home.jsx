import {styled} from "styled-components";
import React, {useState, useEffect, useRef} from "react";
import seoulProjectApi from "../API/seoulProjectApi";

const Home = () => {
  //서울 문화리스트 담는애
  const [seoulList, setSeoulList] = useState([]);
  //데이터 가져오기 시작 인덱스 담는 애
  const [startValue, setStartValue] = useState(0);
  //스크롤 인터섹션 이벤트 중복 호출 방지
  const [isFetching, setIsFetching] = useState(false);

  //서울 리스트 데이터를 무한 스크롤링으로 가져오기 위한 함수
  const handleInfiniteScroll = () => {
    fetchSeoulList(startValue);
  };

  //서울리스트 데이터 가져오는 함수 (api 홀로 호출하는..)
  const fetchSeoulList = async (start) => {
    try {
      const listData = await seoulProjectApi().getSeoulList(start);

      // 예전 데이터를 저장하는 부분을 만들기
      setSeoulList((prevList) => {
        let updatedList = [];
        if (prevList && prevList.row) {
          if (Array.isArray(prevList.row)) {
            updatedList = [...prevList.row, ...(listData.row || [])];
          } else {
            updatedList = [prevList.row, ...(listData.row || [])];
          }
        } else {
          updatedList = [...(listData.row || [])];
        }

        return {...prevList, row: updatedList};
      });

      setStartValue(start + 30);
    } catch (error) {
      console.error("데이터 가져오기 오류: ", error);
    }
  };

  const observerRef = useRef(null);

  //isFetching, startValue가 변경될 때 호출된다.
  useEffect(() => {
    // IntersectionObserver를 사용해서 무한스크롤을 구현한다.
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !isFetching) {
        fetchSeoulList(startValue);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isFetching, startValue]);

  return (
    <>
      <Header>
        <HeaderInner>
          <h1>SeoulProject</h1>
        </HeaderInner>
      </Header>
      <Main>
        <InfoSection>
          <h2>서울 문화 리스트:</h2>
          <DetaList>
            {seoulList && seoulList.row?.length > 0 ? (
              seoulList.row.map((item, index) => (
                <li key={index}>
                  <h3>{item.TITLE}</h3>
                  <p>{item.DATE}</p>
                </li>
              ))
            ) : (
              <li>돌아가</li>
            )}
          </DetaList>
        </InfoSection>
        {/* IntersectionObserver가 관찰할 DOM 요소를 설정하는 역할 */}
        <div ref={observerRef}></div>
      </Main>
    </>
  );
};

const Header = styled.header`
  width: 100%;
  padding: 2rem 0;
  border-bottom: 1px solid gray;
  margin-bottom: 2rem;
  position: fixed;
  background-color: #ffffff;
`;
const HeaderInner = styled.div`
  /* border: 1px solid green; */
  width: 90%;
  /* padding: 2rem */
  margin: 0 auto;

  h1 {
    display: inline-block;
  }

  p {
    /* border: 1px solid navy; */
  }
`;

const Main = styled.main`
  padding-top: 10rem;
`;

const InfoSection = styled.div`
  /* border: 1px solid blue; */
  width: 90%;
  margin: 0 auto;
  h2 {
    font-size: 30px;
    margin-bottom: 10px;
  }
`;

const DetaList = styled.ul`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;

  li {
    border: 1px solid grey;
    border-radius: 5px;
    /* flex-wrap: nowrap; */
    width: 17%;
    padding: 10px;
  }

  h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 20px;
    margin: 20px 0;
  }

  p {
    font-size: 12px;
  }

  @media (max-width: 992px) {
    li {
      width: calc(33.333% - 20px);
    }
  }

  @media (max-width: 768px) {
    li {
      width: calc(50% - 20px);
    }
  }

  @media (max-width: 576px) {
    li {
      width: 100%;
    }
  }
`;

export default Home;
