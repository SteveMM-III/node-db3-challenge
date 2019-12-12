const db = require( '../data/db-config' );

module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove
};

function find() {
  return db( 'schemes' );
}

function findById( id ) {
  return db( 'schemes' )
    .where( { id } )
    .first()
    .then( scheme => scheme ? scheme : null );
}

function findSteps( id ) {
  return db( 'steps as st' )
    .select( 'st.id', 'sc.scheme_name', 'st.step_number', 'st.instructions' )
    .join( 'schemes as sc', 'st.scheme_id', 'sc.id' )
    .where( 'sc.id', id )
    .orderBy( 'st.step_number' );
}

function add( scheme ) {
  return db( 'schemes' )
    .insert( scheme, 'id' )
    .then( ids => {
      const [ id ] = ids;
      return findById( id );
    } );
}

function update( changes, id ) {
  return db( 'schemes' )
    .where( { id } )
    .update( changes )
    .then( () => findById( id ) );
}

function remove( id ) {
  return db( 'schemes' )
    .where( 'id', id )
    .first()
    .then( scheme => {
      return scheme ?
        db( 'schemes' )
          .where( { id } )
          .del()
          .then( () => scheme )
        : null;
    } );
}