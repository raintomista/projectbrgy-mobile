import React, { Component } from 'react';
import { Dimensions, AsyncStorage, View, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text, Header, Icon, Content, Container } from 'native-base';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import Input from 'components/signup/Input';
import PageButton from 'components/signup/PageButton';
import SignupForm from 'components/signup/SignupForm';
import DropdownField from 'components/signup/DropdownField';


import { HeaderWithGoBack } from 'components/common'
import { 
  getRegions as _getRegions, 
  getProvinces as _getProvinces, 
  getMunicipalities as _getMunicipalities,
  getBarangays as _getBarangays,
  getBarangayDetails
} from 'services/AuthService';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'
import * as localized from 'localization/en';


@observer
export default class Signup extends Component {
  @observable page = 1;
  @observable regions = ['Select Region'];
  @observable provinces = ['Select Province'];
  @observable municipalities = ['Select Municipality'];
  @observable barangays = ['Select Barangay'];
  
  

  @observable selectedRegion = 'Select Region';
  @observable selectedProvince = 'Select Province';
  @observable selectedMunicipality = 'Select Municipality';
  @observable selectedBarangay = 'Select Barangay';

  constructor(props) {
    super(props);
    this.form = new SignupForm();
    this.getRegions();    
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderWithGoBack />
        <LinearGradient 
          colors={[colors.PRIMARY, colors.SECONDARY]} 
          style={styles.linearGradientView}
        >
          <View style={{marginTop: -56}}>
            <Text style={styles.title}>
              Sign Up
            </Text>
            {this.page === 1 && (
              <React.Fragment>
                <Input 
                  placeholder="First Name" 
                  field={this.form.$('first_name')}
                />
                <Input 
                  placeholder="Middle Name (optional)" 
                  field={this.form.$('middle_name')}                      
                />
                <Input 
                  placeholder="Last Name" 
                  field={this.form.$('last_name')}                      
                />
                <Input 
                  placeholder="Email Address" 
                  field={this.form.$('email')}                      
                />
              </React.Fragment>
            )}

            {this.page === 2 && (
              <React.Fragment>
                <Input 
                  placeholder="Username" 
                  field={this.form.$('username')}                      
                />
                <Input 
                  placeholder="Password (must be at least 8 characters long)" 
                  field={this.form.$('password')}                      
                />
                <Input 
                  placeholder="Mobile Phone (optional)" 
                  field={this.form.$('mobile_number')}                                            
                />
                <Input 
                  placeholder="Landline (optional)" 
                  field={this.form.$('landline_number')}   
                />
              </React.Fragment>
            )}

            {this.page === 3 && (
              <React.Fragment>
                <DropdownField
                  options={this.regions}
                  selectedValue={this.selectedRegion}
                  handleSelect={(region) => this.handleSelectRegion(region)}
                />
                <DropdownField
                  options={this.provinces}
                  selectedValue={this.selectedProvince}
                  handleSelect={(province) => this.handleSelectProvince(province)}
                />
                <DropdownField
                  options={this.municipalities}
                  selectedValue={this.selectedMunicipality}
                  handleSelect={(municipality) => this.handleSelectMunicipality(municipality)}
                />
                <DropdownField
                  options={this.barangays}
                  selectedValue={this.selectedBarangay}
                  handleSelect={(barangay) => this.handleSelectBarangay(barangay)}                  
                />
              </React.Fragment>
            )}

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
              <PageButton 
                label="Back"
                handlePress={() => this.handlePrev()}
                disabled={this.page === 1}        
              />
              {this.page === 3 
                ? <PageButton 
                    label="Submit"
                    handlePress={(e) => this.handleSubmit(e)}    
                    marginLeft={10}        
                  />
                : <PageButton
                    label="Proceed"
                    handlePress={() => this.handleNext()}
                    marginLeft={10}                                
                  />
              }
            </View>
          </View>
        </LinearGradient>        
      </View>
    );
  }

  @action 
  async getRegions() {
    const response = await _getRegions(false);

    runInAction(() => {
      this.regions.push(...response.data.data.items);
    })
  }

  @action
  async handleSelectRegion(region) {
    this.selectedRegion = region;    
    if(region === 'Select Region') {
      runInAction(() => {
        this.selectedProvince = 'Select Province';
        this.selectedMunicipality = 'Select Municipality';
        this.selectedBarangay = 'Select Barangay';
        this.provinces = ['Select Province'];
        this.municipalities = ['Select Municipality'];
        this.barangays = ['Select Barangay'];
      });
    } else {
      const response = await _getProvinces(region, false);
      runInAction(() => {
        this.provinces = ['Select Province', ...response.data.data.items];
      })
    }
  }

  @action
  async handleSelectProvince(province) {
    this.selectedProvince = province;    
    if(province === 'Select Province') {
      runInAction(() => {
        this.selectedMunicipality = 'Select Municipality';
        this.selectedBarangay = 'Select Barangay';
        this.municipalities = ['Select Municipality'];
        this.barangays = ['Select Barangay'];
      });
    } else {
      const response = await _getMunicipalities(this.selectedRegion, province, false);
      runInAction(() => {
        this.municipalities = ['Select Municipality', ...response.data.data.items];
      })
    }
  }

  @action
  async handleSelectMunicipality(municipality) {
    this.selectedMunicipality = municipality;    
    if(municipality === 'Select Municipality') {
      runInAction(() => {
        this.selectedBarangay = 'Select Barangay';
        this.barangays = ['Select Barangay'];
      });
    } else {
      const response = await _getBarangays(this.selectedRegion, this.selectedProvince, municipality, false);
      runInAction(() => {
        this.barangays = ['Select Barangay', ...response.data.data.items];
      })
    }
  }


  @action
  async handleSelectBarangay(barangay) {
    this.selectedBarangay = barangay;    
    if(barangay === 'Select Barangay') {
      this.form.$('barangay_id').set('value', null);      
    } else {
      const response = await getBarangayDetails(this.selectedRegion, this.selectedProvince, this.selectedMunicipality, barangay);
      this.form.$('barangay_id').set('value', response.data.data.id);
    } 
  }

  @action
  handlePrev() {
    this.page = this.page > 1 ? this.page - 1 : 3;
  }

  @action
  handleNext() {
    this.page = this.page < 3 ? this.page + 1 : 1;
  }

  @action
  async handleSubmit(e) {
    this.form.onSubmit(e)
  }
}

const styles = StyleSheet.create({
  linearGradientView: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    height: responsiveHeight(100),    
    paddingHorizontal: 20, 
    zIndex: -1
  },
  title: {
    color: 'white',    
    fontSize: 38,
    fontFamily: fonts.MONTSERRAT_BOLD,
    marginBottom: 30,
    textAlign: 'left'
  }
});