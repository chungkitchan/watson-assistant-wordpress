<?php
/*
Plugin Name: WP Data Logger
Description: Logging and debug events and vars on site. For adding data in log use the hook: <br><code>do_action( 'logger', $data );</code>
Author: WPCraft & Nebster
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Version: 1.3
*/

if( ! class_exists( 'LoggerU7' ) ){ class LoggerU7{
	
	protected static $instance;
	
	public static function instance(){
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	function __construct(){
		add_action('admin_menu', function(){
			add_management_page(
				$page_title = 'Logger',
				$menu_title = 'Logger',
				$capability = 'manage_options',
				$menu_slug = 'logger',
				$func = array($this, 'display_page')
			);
		});

		add_filter( "plugin_action_links_" . plugin_basename( __FILE__ ), array($this, 'add_settings_link') );
		add_action( 'wp_ajax_LoggerClearLog', array($this, 'clear_log') );
		add_action('logger', array($this, 'add'));
	}

	function display_page(){

		echo '<h1>Log</h1>';
		echo '<p>For adding data to log use the hook: <code>do_action( \'logger\', $data );</code></p>';
		echo '<a class="button clear_log" href="">Clear Log</a><hr>';

		$data = get_option('logger_u7');
		if( ! is_array($data)){
			echo '<p>These is no data in the log</p>';
			return;
		}

		$data = array_reverse($data);
	?>
	<table border="1" width="100%" class="logger_table">
		<tr>
		  <th>Date</th>
		  <th>Data</th>
		</tr>
		<?php 
			$i = 0;
			foreach($data as $item): 
			$i++;
		?>
		  <tr class="data" id="loggerDataRow_<?php echo $i; ?>">
			<td valign="top" width="100px" class="dblClickToScroll" title="Double click for scrolling to next row">
			  <span><?php echo $item['timestamp']; ?></span>
			</td>
			<td>
			  <pre><?php var_dump($item['data']) ?></pre>
			</td>
		  </tr>
		<?php endforeach; ?>
	</table>

	<style>
		.dblClickToScroll{ cursor : pointer }
	</style>
	<script>
		jQuery( '.clear_log' ).click( function( eventObject ){
			eventObject.preventDefault();
			jQuery.post( 
				'<?php echo get_admin_url() ?>/admin-ajax.php',
				{
					action : 'LoggerClearLog'
				},
				function( response ){
					response = JSON.parse( response );
					if ( response.done == true ){
						jQuery( '.logger_table tr.data' ).remove();
					}
				}
			);
		} )
		
		jQuery( '.dblClickToScroll' ).dblclick( function(){
			var nextRow = jQuery( this ).closest( 'tr.data' ).next( 'tr.data' );
			if ( nextRow.length )
			jQuery('body,html').animate({scrollTop: nextRow.offset().top - 60}, 600);
		} )

		jQuery
	</script>
<?php
	}

	function add($data = ''){
		$log = get_option('logger_u7');
		if(empty($log)){
			$log = array();
		}

		$log[] = array(
			'timestamp' => date("Y-m-d H:i:s"),
			'data' => $data,
		);

		$log = array_slice($log, -99, 99);

		update_option('logger_u7', $log, false);
	}

	/**
	* Add fast link in plugins list
	*/
	function add_settings_link($links){
		$settings_link = '<a href="tools.php?page=logger_u7">Logger</a>';
		array_unshift( $links, $settings_link );
		return $links;
	}
  
	function clear_log(){
		update_option('logger_u7', array(), false);
		wp_die( json_encode( array( 'done' => true ) ) );
	}
}

LoggerU7::instance(); }