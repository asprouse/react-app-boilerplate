import React                  from 'react';
import { PropTypes as Type }  from 'react';


export default (fetch) => {

  return DecoratedComponent => (


    class FetchDataDecorator extends React.Component {

      static propTypes = {

        store: Type.shape({
          dispatch: Type.func
        }),

        location     : Type.object,
        params       : Type.object,
        initialRender: Type.bool

      };


      componentDidMount() {

        if (this.props.initialRender) return;

        const { location, params, store } = this.props;

        fetch({
          location,
          params,
          dispatch: store.dispatch
        });

      }


      render() {

        return (
          <DecoratedComponent {...this.props} />
        );

      }

    }


  );

}
