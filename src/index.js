const _ = require( 'lodash' );
const Converter = require( './Converter.js' );
const EnvironmentMapper = require( './EnvironmentMapper.js' );
const JsonSchemaValidator = require( './JsonSchemaValidator.js' );

const loadInstanceCatalog = require( './instanceCatalog/instanceCatalogLoader.js' );

const FarmRulesMapper = require( './farm/FarmRulesMapper.js' );
const FarmTargetsMapper = require( './farm/FarmTargetsMapper.js' );

const InstanceRulesMapper = require( './instance/InstanceRulesMapper.js' );
const InstanceTargetsMapper = require( './instance/InstanceTargetsMapper.js' );

const OrgRulesMapper = require( './org/OrgRulesMapper.js' );
const OrgTargetsMapper = require( './org/OrgTargetsMapper.js' );

const BooleanVariationMapper = require( './variations/BooleanVariationMapper.js' );
const MultiVariationMapper = require( './variations/MultiVariationMapper.js' );

const farmBooleanSchemaV1_0 = require( '../schemas/farm-boolean/v1_0.json' );
const farmBooleanSchemaV1_1 = require( '../schemas/farm-boolean/v1_1.json' );
const farmBooleanSchemaV1_2 = require( '../schemas/farm-boolean/v1_2.json' );
const farmBooleanSchemaV3_0 = require( '../schemas/farm-boolean/v3_0.json' );

const farmMultivariateSchemaV1_0 = require( '../schemas/farm-multivariate/v1_0.json' );
const farmMultivariateSchemaV1_1 = require( '../schemas/farm-multivariate/v1_1.json' );
const farmMultivariateSchemaV3_0 = require( '../schemas/farm-multivariate/v3_0.json' );
const farmMultivariateSchemaV3_1 = require( '../schemas/farm-multivariate/v3_1.json' );

const instanceBooleanSchemaV1_0 = require( '../schemas/instance-boolean/v1_0.json' );
const instanceBooleanSchemaV1_1 = require( '../schemas/instance-boolean/v1_1.json' );
const instanceBooleanSchemaV1_2 = require( '../schemas/instance-boolean/v1_2.json' );
const instanceBooleanSchemaV1_3 = require( '../schemas/instance-boolean/v1_3.json' );
const instanceBooleanSchemaV3_0 = require( '../schemas/instance-boolean/v3_0.json' );
const instanceBooleanSchemaV3_2 = require( '../schemas/instance-boolean/v3_2.json' );

const instanceMultivariateSchemaV1_0 = require( '../schemas/instance-multivariate/v1_0.json' );
const instanceMultivariateSchemaV1_1 = require( '../schemas/instance-multivariate/v1_1.json' );
const instanceMultivariateSchemaV2_0 = require( '../schemas/instance-multivariate/v2_0.json' );
const instanceMultivariateSchemaV2_1 = require( '../schemas/instance-multivariate/v2_1.json' );
const instanceMultivariateSchemaV3_0 = require( '../schemas/instance-multivariate/v3_0.json' );
const instanceMultivariateSchemaV3_1 = require( '../schemas/instance-multivariate/v3_1.json' );
const instanceMultivariateSchemaV3_2 = require( '../schemas/instance-multivariate/v3_2.json' );

const orgBooleanSchemaV1_0 = require( '../schemas/org-boolean/v1_0.json' );
const orgBooleanSchemaV1_1 = require( '../schemas/org-boolean/v1_1.json' );
const orgBooleanSchemaV1_2 = require( '../schemas/org-boolean/v1_2.json' );
const orgBooleanSchemaV3_0 = require( '../schemas/org-boolean/v3_0.json' );
const orgBooleanSchemaV3_2 = require( '../schemas/org-boolean/v3_2.json' );

const orgMultivariateSchemaV1_0 = require( '../schemas/org-multivariate/v1_0.json' );
const orgMultivariateSchemaV1_1 = require( '../schemas/org-multivariate/v1_1.json' );
const orgMultivariateSchemaV2_0 = require( '../schemas/org-multivariate/v2_0.json' );
const orgMultivariateSchemaV2_1 = require( '../schemas/org-multivariate/v2_1.json' );
const orgMultivariateSchemaV3_0 = require( '../schemas/org-multivariate/v3_0.json' );
const orgMultivariateSchemaV3_1 = require( '../schemas/org-multivariate/v3_1.json' );
const orgMultivariateSchemaV3_2 = require( '../schemas/org-multivariate/v3_2.json' );

const booleanFeatureKind = 'boolean';
const multivariateFeatureKind = 'multivariate';

const generateFlagTag = 'lms-generated-flag';
const farmFlagTag = 'lms-farm-flag';
const instanceFlagTag = 'lms-instance-flag';
const orgFlagTag = 'lms-org-flag';

function createSchemaValiators( schemas ) {

	const validators = {};

	_.forEach( schemas, schema => {
		validators[ schema.$id ] = new JsonSchemaValidator( schema );
	} );

	return validators;
}

function* createConverters( instanceCatalog ) {

	const booleanVariationMapper = new BooleanVariationMapper();
	const multiVariationMapper = new MultiVariationMapper();

	const farmTargetsMapper = new FarmTargetsMapper();
	const farmRulesMapper = new FarmRulesMapper();
	const farmEnvironmentMapper = new EnvironmentMapper( farmTargetsMapper, farmRulesMapper );

	const instanceTargetsMapper = new InstanceTargetsMapper( instanceCatalog );
	const instanceRulesMapper = new InstanceRulesMapper( instanceCatalog );
	const instanceEnvironmentMapper = new EnvironmentMapper( instanceTargetsMapper, instanceRulesMapper );

	const orgTargetsMapper = new OrgTargetsMapper( instanceCatalog );
	const orgRulesMapper = new OrgRulesMapper( instanceCatalog );
	const orgEnvironmentMapper = new EnvironmentMapper( orgTargetsMapper, orgRulesMapper );

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			farmBooleanSchemaV1_0,
			farmBooleanSchemaV1_1,
			farmBooleanSchemaV1_2,
			farmBooleanSchemaV3_0
		] ),
		booleanVariationMapper,
		farmEnvironmentMapper,
		[ generateFlagTag, farmFlagTag ]
	);
	
	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			farmMultivariateSchemaV1_0,
			farmMultivariateSchemaV1_1,
			farmMultivariateSchemaV3_0,
			farmMultivariateSchemaV3_1
		] ),
		multiVariationMapper,
		farmEnvironmentMapper,
		[ generateFlagTag, farmFlagTag ]
	);

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			instanceBooleanSchemaV1_0,
			instanceBooleanSchemaV1_1,
			instanceBooleanSchemaV1_2,
			instanceBooleanSchemaV1_3,
			instanceBooleanSchemaV3_0,
			instanceBooleanSchemaV3_2
		] ),
		booleanVariationMapper,
		instanceEnvironmentMapper,
		[ generateFlagTag, instanceFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			instanceMultivariateSchemaV1_0,
			instanceMultivariateSchemaV1_1,
			instanceMultivariateSchemaV2_0,
			instanceMultivariateSchemaV2_1,
			instanceMultivariateSchemaV3_0,
			instanceMultivariateSchemaV3_1,
			instanceMultivariateSchemaV3_2
		] ),
		multiVariationMapper,
		instanceEnvironmentMapper,
		[ generateFlagTag, instanceFlagTag ]
	);

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			orgBooleanSchemaV1_0,
			orgBooleanSchemaV1_1,
			orgBooleanSchemaV1_2,
			orgBooleanSchemaV3_0,
			orgBooleanSchemaV3_2
		] ),
		booleanVariationMapper,
		orgEnvironmentMapper,
		[ generateFlagTag, orgFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			orgMultivariateSchemaV1_0,
			orgMultivariateSchemaV1_1,
			orgMultivariateSchemaV2_0,
			orgMultivariateSchemaV2_1,
			orgMultivariateSchemaV3_0,
			orgMultivariateSchemaV3_1,
			orgMultivariateSchemaV3_2
		] ),
		multiVariationMapper,
		orgEnvironmentMapper,
		[ generateFlagTag, orgFlagTag ]
	);
}

module.exports = function( options, callback ) {

	loadInstanceCatalog( ( err, instanceCatalog ) => {

		if( err ) {
			return callback( err );
		}

		const converters = Array.from( createConverters( instanceCatalog ) );
		return callback( null, converters );
	} );
};
