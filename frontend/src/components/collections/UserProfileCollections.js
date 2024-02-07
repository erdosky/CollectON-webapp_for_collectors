import React from "react";
import { Link } from "react-router-dom";

class UserProfileCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredCollectionId: null,
    };
  }

  handleCollectionClick = (collectionId) => {
    window.location.href = `http://localhost:3001/exploreCollection/${collectionId}`;
  };

  handleMouseEnter = (collectionId) => {
    this.setState({
      hoveredCollectionId: collectionId,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hoveredCollectionId: null,
    });
  };

  render() {
    const { collections } = this.props;
    const { hoveredCollectionId } = this.state;

    return (
      <div className="collection__wrapper__user">
        <div className='ProfileTitle'>Users Collections</div>
        <div className="collection__wrapper">
        {collections.map((collection, index) => (
          <div
            key={index}
            className={`collection__item ${hoveredCollectionId === collection._id ? 'hovered' : ''}`}
            onMouseEnter={() => this.handleMouseEnter(collection._id)}
            onMouseLeave={this.handleMouseLeave}
          >
            <Link to={`/exploreCollection/${collection._id}`}>
              <figure className="collection__image__wrap" data-category={collection.type}>
                {collection.image === "" || collection.image === null ? (
                  ""
                ) : (
                  <img className="collection__image" width={100} height={100} alt="" src={collection.image} />
                )}
                {hoveredCollectionId === collection._id && (
                  <div className="collection__description">
                    <p>Description: {collection.description}</p>
                  </div>
                )}
              </figure>
            </Link>
            <div className="collection__item__info">
              <p>Name: {collection.name}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    );
  }
}

export default UserProfileCollections;
